export const SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'YOUR_SUPABASE_PUBLISHABLE_KEY';

export function isSupabaseConfigured() {
  return !SUPABASE_URL.includes('YOUR_PROJECT_REF')
    && !SUPABASE_PUBLISHABLE_KEY.includes('YOUR_SUPABASE_PUBLISHABLE_KEY');
}
