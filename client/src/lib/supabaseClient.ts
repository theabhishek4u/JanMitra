import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : 'https://ywwwsvwyxdegjjsokqjk.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder_key'
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3d3dzdnd5eGRlZ2pqc29rcWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMzEwODAsImV4cCI6MjA5ODgwNzA4MH0.qYyk4gg6kvpBvdSLHB-mLJmdW3kFtvObBcEY5x-E3AQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

