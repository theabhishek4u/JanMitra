import { createClient } from '@supabase/supabase-js';
import { mockDb, Profile, Suggestion, MediaAttachment, TimelineEvent, Department, AreaPopulation } from './mockDb';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from cwd or server directory
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let isServiceRole = false;
try {
  const payload = JSON.parse(Buffer.from(supabaseKey.split('.')[1], 'base64').toString());
  isServiceRole = payload.role === 'service_role';
} catch (e) {
  // Ignore
}

// We ideally require a true service role key for the backend to bypass RLS, 
// but we will allow connection with the anon key so data can at least be stored.
export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

if (isSupabaseConfigured && !isServiceRole) {
  console.warn('WARNING: Connected to Supabase with an ANON KEY instead of a SERVICE ROLE KEY. Operations may fail if RLS is enabled and restricts anon access.');
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

if (isSupabaseConfigured) {
  console.log('Database connected: Supabase PostgreSQL is active.');
} else {
  console.log('Database connected: Supabase credentials not found. Falling back to in-memory database.');
}

export const db = {
  getProfile: async (id: string): Promise<Profile | null> => {
    if (supabase) {
      const { data: citizen } = await supabase
        .from('citizen_profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (citizen) return { ...citizen, role: 'citizen' };

      const { data: mp } = await supabase
        .from('mp_profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (mp) return { ...mp, role: 'mp' };

      const { data: admin } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (admin) return { ...admin, role: 'admin' };
    }
    return mockDb.getProfile(id);
  },

  upsertProfile: async (profile: Partial<Profile> & { id: string }): Promise<Profile> => {
    if (supabase) {
      const role = (profile.role as string) || 'citizen';
      const table = role === 'mp' ? 'mp_profiles' : role === 'admin' ? 'admin_profiles' : 'citizen_profiles';
      const { data, error } = await supabase
        .from(table)
        .upsert({
          ...profile,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      if (error) {
        console.error(`Supabase ${table} upsert error, using mockDb fallback:`, error.message);
        return mockDb.upsertProfile(profile);
      }
      return data;
    }
    return mockDb.upsertProfile(profile);
  },

  getSuggestions: async (filters?: { citizen_id?: string; category?: string; district?: string; village?: string }): Promise<Suggestion[]> => {
    let supabaseData: Suggestion[] = [];
    if (supabase) {
      let query = supabase.from('suggestions').select('*');
      if (filters?.citizen_id) {
        const demoCitizenIds = [
          '3683b237-4045-4b54-96ad-ba7b12f8bc13',
          '82d75bff-b6e9-4da4-9dcd-bedc3ba10158',
          '19bbb93b-1c28-4665-8607-6998c700a03b'
        ];
        if (demoCitizenIds.includes(filters.citizen_id)) {
          query = query.in('citizen_id', demoCitizenIds);
        } else {
          query = query.eq('citizen_id', filters.citizen_id);
        }
      }
      if (filters?.category) {
        query = query.ilike('category', `%${filters.category}%`);
      }
      if (filters?.district) {
        query = query.ilike('district', `%${filters.district}%`);
      }
      if (filters?.village) {
        query = query.ilike('village', `%${filters.village}%`);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data) {
        supabaseData = data;
      }
    }
    const mockData = await mockDb.getSuggestions(filters);
    const merged = [...supabaseData];
    
    // Merge properties for matching IDs
    for (let i = 0; i < merged.length; i++) {
      const mockItem = mockData.find(m => m.id === merged[i].id);
      if (mockItem) {
        merged[i] = { ...mockItem, ...merged[i] };
      }
    }

    const existingIds = new Set(merged.map(s => s.id));
    for (const item of mockData) {
      if (!existingIds.has(item.id)) merged.push(item);
    }
    return merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getSuggestionById: async (id: string): Promise<Suggestion | null> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        return mockDb.getSuggestionById(id);
      }
      const mockItem = await mockDb.getSuggestionById(id);
      if (mockItem) {
        return { ...mockItem, ...data };
      }
      return data;
    }
    return mockDb.getSuggestionById(id);
  },

  createSuggestion: async (suggestion: Omit<Suggestion, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Promise<Suggestion> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('suggestions')
        .insert({
          ...suggestion,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Supabase suggestion creation error, using mockDb fallback:', error.message);
        return mockDb.createSuggestion(suggestion);
      }

      // Add timeline event
      await supabase.from('timeline_events').insert({
        suggestion_id: data.id,
        status: data.status || 'submitted',
        notes: 'Development suggestion successfully registered.'
      });

      return data;
    }
    return mockDb.createSuggestion(suggestion);
  },

  deleteSuggestion: async (id: string): Promise<boolean> => {
    if (supabase) {
      const { error } = await supabase
        .from('suggestions')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Supabase suggestion deletion error, using mockDb fallback:', error.message);
        return mockDb.deleteSuggestion(id);
      }
      return true;
    }
    return mockDb.deleteSuggestion(id);
  },

  addMediaAttachment: async (attachment: Omit<MediaAttachment, 'id' | 'created_at'>): Promise<MediaAttachment> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('media_attachments')
        .insert(attachment)
        .select()
        .single();
      if (error) {
        console.error('Supabase attachment insertion error, using mockDb fallback:', error.message);
        return mockDb.addMediaAttachment(attachment);
      }
      return data;
    }
    return mockDb.addMediaAttachment(attachment);
  },

  getMediaAttachments: async (suggestionId: string): Promise<MediaAttachment[]> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('media_attachments')
        .select('*')
        .eq('suggestion_id', suggestionId);
      if (error) {
        return mockDb.getMediaAttachments(suggestionId);
      }
      return data || [];
    }
    return mockDb.getMediaAttachments(suggestionId);
  },

  getTimelineEvents: async (suggestionId: string): Promise<TimelineEvent[]> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .eq('suggestion_id', suggestionId)
        .order('created_at', { ascending: true });
      if (error) {
        return mockDb.getTimelineEvents(suggestionId);
      }
      return data || [];
    }
    return mockDb.getTimelineEvents(suggestionId);
  },

  getNotifications: async (userId: string) => {
    if (supabase) {
      const { data, error } = await supabase
        .from('app_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) {
        return mockDb.getNotifications(userId);
      }
      return data || [];
    }
    return mockDb.getNotifications(userId);
  },

  markNotificationRead: async (id: string) => {
    if (supabase) {
      const { data, error } = await supabase
        .from('app_notifications')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        return mockDb.markNotificationRead(id);
      }
      return data;
    }
    return mockDb.markNotificationRead(id);
  },

  updateSuggestionStatus: async (id: string, status: string): Promise<Suggestion | null> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('suggestions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.error('Supabase suggestion status update error, using mockDb fallback:', error.message);
        return mockDb.updateSuggestionStatus(id, status);
      }
      return data;
    }
    return mockDb.updateSuggestionStatus(id, status);
  },

  addTimelineEvent: async (event: Omit<TimelineEvent, 'id' | 'created_at'>): Promise<TimelineEvent> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('timeline_events')
        .insert(event)
        .select()
        .single();
      
      // Keep suggestions status column in sync in Supabase
      const { data: suggestionData } = await supabase
        .from('suggestions')
        .update({ status: event.status, updated_at: new Date().toISOString() })
        .eq('id', event.suggestion_id)
        .select()
        .single();

      if (error) {
        console.error('Supabase timeline insertion error, using mockDb fallback:', error.message);
        return mockDb.addTimelineEvent(event);
      }
      
      // Generate Notification if completed
      if (suggestionData && event.status === 'completed') {
        const notif = {
          user_id: suggestionData.citizen_id,
          title: 'Complaint Completed',
          message: `Your complaint ${suggestionData.complaint_number || event.suggestion_id.substring(0, 8)} has been marked as completed by the MP.`
        };
        const { error: notifErr } = await supabase.from('app_notifications').insert([notif]);
        if (notifErr) {
          console.log('Falling back to mockDb for notifications (table might not exist yet).');
          await mockDb.addNotification(notif);
        }
      }
        
      return data;
    }
    
    const newEvent = await mockDb.addTimelineEvent(event);
    if (event.status === 'completed') {
      const suggestion = await mockDb.getSuggestionById(event.suggestion_id);
      if (suggestion) {
        await mockDb.addNotification({
          user_id: suggestion.citizen_id,
          title: 'Complaint Completed',
          message: `Your complaint ${suggestion.complaint_number || event.suggestion_id.substring(0,8)} has been marked as completed by the MP.`
        });
      }
    }
    return newEvent;
  },



  getCitizens: async () => {
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'citizen');
      if (error) {
        console.error('Supabase citizens fetch error, using mockDb fallback:', error.message);
        return mockDb.getCitizens();
      }
      return data;
    }
    return mockDb.getCitizens();
  },

  updateVerificationStatus: async (userId: string, status: 'incomplete' | 'pending' | 'verified' | 'rejected') => {
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ verification_status: status, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
      if (error) {
        console.error('Supabase verification status update error, using mockDb fallback:', error.message);
        return mockDb.updateVerificationStatus(userId, status);
      }
      return data;
    }
    return mockDb.updateVerificationStatus(userId, status);
  },

  getAllSuggestions: async () => {
    let supabaseData: Suggestion[] = [];
    if (supabase) {
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        supabaseData = data;
      }
    }
    const mockData = await mockDb.getAllSuggestions();
    const merged = [...supabaseData];
    
    // Merge properties for matching IDs
    for (let i = 0; i < merged.length; i++) {
      const mockItem = mockData.find(m => m.id === merged[i].id);
      if (mockItem) {
        merged[i] = { ...mockItem, ...merged[i] };
      }
    }

    const existingIds = new Set(merged.map(s => s.id));
    for (const item of mockData) {
      if (!existingIds.has(item.id)) merged.push(item);
    }
    return merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getStats: async () => {
    const allSugg = await db.getAllSuggestions();
    
    let citizenCount = 0;
    if (supabase) {
      const { count } = await supabase.from('citizen_profiles').select('*', { count: 'exact', head: true });
      if (count !== null && count !== undefined) {
        citizenCount = count;
      }
    }
    
    const mockStats = await mockDb.getStats();
    if (!citizenCount) {
      citizenCount = mockStats.citizenCount;
    }

    const totalSuggestions = allSugg.length;
    const highPriority = allSugg.filter(s => s.urgency === 'critical' || s.urgency === 'high').length;
    const activeProjects = allSugg.filter(s => s.status === 'planned' || s.status === 'under_review').length;
    const completed = allSugg.filter(s => s.status === 'completed').length;
    const pendingReview = allSugg.filter(s => s.status === 'submitted' || s.status === 'under_review').length;
    const totalBeneficiaries = allSugg.reduce((sum, s) => sum + (s.estimated_beneficiaries || 0), 0);
    const totalCostLakhs = allSugg.reduce((sum, s) => sum + (s.estimated_cost_lakhs || 0), 0);
    
    return { citizenCount, totalSuggestions, highPriority, activeProjects, completed, pendingReview, totalBeneficiaries, totalCostLakhs };
  },

  addSupport: async (proposalId: string, userId: string): Promise<boolean> => {
    if (supabase) {
      // Check duplicate
      const { data: existing } = await supabase
        .from('proposal_supports')
        .select('*')
        .eq('proposal_id', proposalId)
        .eq('user_id', userId)
        .single();
      
      if (existing) return false;

      // Insert support
      const { error: insertError } = await supabase
        .from('proposal_supports')
        .insert({ proposal_id: proposalId, user_id: userId });

      if (insertError) {
        console.error('Supabase support insertion error:', insertError.message);
        return mockDb.addSupport(proposalId, userId);
      }

      // Get current support count
      const { data: suggestion } = await supabase
        .from('suggestions')
        .select('support_count')
        .eq('id', proposalId)
        .single();

      const nextCount = (suggestion?.support_count || 0) + 1;

      // Recalculate Consensus Score
      const citizenScore = Math.min(40, Math.round((nextCount / 1000) * 40));
      const mukhiyaScore = (nextCount % 2 === 0) ? 25 : 0;
      const mlaScore = (nextCount > 100) ? 20 : 10;
      const aiScore = 15; // default simulated AI score weight
      const nextConsensus = Math.min(100, citizenScore + mukhiyaScore + mlaScore + aiScore);

      // Update suggestion
      await supabase
        .from('suggestions')
        .update({ support_count: nextCount, consensus_score: nextConsensus })
        .eq('id', proposalId);

      return true;
    }
    return mockDb.addSupport(proposalId, userId);
  },

  hasSupported: async (proposalId: string, userId: string): Promise<boolean> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('proposal_supports')
        .select('*')
        .eq('proposal_id', proposalId)
        .eq('user_id', userId)
        .single();
      return !!data && !error;
    }
    return mockDb.hasSupported(proposalId, userId);
  },

  getSupportedSuggestions: async (userId: string): Promise<Suggestion[]> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('proposal_supports')
        .select('*, suggestions(*)')
        .eq('user_id', userId);
      
      if (!error && data) {
        return data.map((d: any) => d.suggestions).filter(Boolean);
      }
    }
    return mockDb.getSupportedSuggestions(userId);
  },

  getPopulations: async (): Promise<AreaPopulation[]> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('area_populations')
        .select('*');
      if (!error && data) {
        return data as AreaPopulation[];
      }
    }
    return mockDb.getPopulations();
  },

  addOrUpdatePopulation: async (pop: Omit<AreaPopulation, 'id'> & { id?: string }): Promise<AreaPopulation> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('area_populations')
        .upsert({
          id: pop.id || undefined,
          district: pop.district,
          area: pop.area,
          total_population: pop.total_population,
          male_percentage: pop.male_percentage,
          female_percentage: pop.female_percentage,
          age_0_18_percentage: pop.age_0_18_percentage,
          age_18_60_percentage: pop.age_18_60_percentage,
          age_60_plus_percentage: pop.age_60_plus_percentage
        })
        .select()
        .single();
      if (!error && data) {
        return data as AreaPopulation;
      }
      console.error('Supabase population upsert error:', error?.message);
    }
    return mockDb.addOrUpdatePopulation(pop);
  },

  deletePopulation: async (id: string): Promise<boolean> => {
    if (supabase) {
      const { error } = await supabase
        .from('area_populations')
        .delete()
        .eq('id', id);
      if (!error) return true;
    }
    return mockDb.deletePopulation(id);
  },

  getDepartments: async (): Promise<Department[]> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as Department[];
      }
    }
    return mockDb.getDepartments();
  },

  createDepartment: async (dept: Omit<Department, 'created_at'>): Promise<Department> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('departments')
        .insert({
          ...dept,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      if (!error && data) {
        return data as Department;
      }
    }
    return mockDb.createDepartment(dept);
  },

  updateDepartment: async (id: string, updates: Partial<Department>): Promise<Department | null> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('departments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return data as Department;
      }
    }
    return mockDb.updateDepartment(id, updates);
  },

  deleteDepartment: async (id: string): Promise<boolean> => {
    if (supabase) {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);
      if (!error) {
        return true;
      }
    }
    return mockDb.deleteDepartment(id);
  }
};
