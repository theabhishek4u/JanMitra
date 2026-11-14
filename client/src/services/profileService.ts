import { supabase } from '../lib/supabaseClient';

export interface ProfileData {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  role: 'citizen' | 'mp' | 'admin';
  pincode?: string;
  language_preference?: string;
  contribution_score?: number;
  state?: string;
  district?: string;
  parliamentary_constituency?: string;
  assembly_constituency?: string;
  village_ward?: string;
  state_id?: number;
  district_id?: number;
  parliamentary_constituency_id?: number;
  assembly_constituency_id?: number;
  village_id?: number;
  aadhaar_number?: string;
  verification_status?: 'incomplete' | 'pending' | 'verified' | 'rejected';
}

export const profileService = {
  getProfile: async (userId: string, role: 'citizen' | 'mp' | 'admin'): Promise<ProfileData> => {
    let tableName = 'citizen_profiles';
    if (role === 'mp') tableName = 'mp_profiles';
    if (role === 'admin') tableName = 'admin_profiles';

    const getFallbackProfile = (): ProfileData => {
      if (role === 'mp') {
        return {
          id: userId,
          full_name: 'Dr. Vikram Singh',
          email: 'mp@jansunwai.gov.in',
          role: 'mp',
          state: 'Uttar Pradesh',
          district: 'Lucknow',
          parliamentary_constituency: 'Lucknow',
          assembly_constituency: 'Lucknow Central',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150'
        };
      }
      if (role === 'admin') {
        return {
          id: userId,
          full_name: 'Super Administrator',
          email: 'admin@jansunwai.gov.in',
          role: 'admin',
          avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150'
        };
      }
      return {
        id: userId,
        full_name: 'Aarav Sharma',
        email: 'citizen@jansunwai.gov.in',
        phone: '+91 98765 43210',
        role: 'citizen',
        state: 'Uttar Pradesh',
        district: 'Varanasi',
        parliamentary_constituency: 'Varanasi',
        assembly_constituency: 'Varanasi Cantt',
        village_ward: 'Sigra Ward',
        pincode: '221002',
        contribution_score: 85,
        verification_status: 'verified',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150'
      };
    };

    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return getFallbackProfile();
      }
      
      return { ...data, role };
    } catch (err) {
      console.warn('Network error in getProfile, using demo profile fallback:', err);
      return getFallbackProfile();
    }
  },

  updateProfile: async (userId: string, role: 'citizen' | 'mp' | 'admin', profileData: Partial<ProfileData>): Promise<ProfileData> => {
    let tableName = 'citizen_profiles';
    if (role === 'mp') tableName = 'mp_profiles';
    if (role === 'admin') tableName = 'admin_profiles';

    const updateData: Record<string, unknown> = {};
    Object.entries(profileData).forEach(([key, val]) => {
      if (key !== 'id' && key !== 'role') {
        updateData[key] = val;
      }
    });

    const { data, error } = await supabase
      .from(tableName)
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { ...data, role };
  }
};
