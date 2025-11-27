import { createClient as createSupabaseBrowserClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey);

export const createSupabaseClient = () => supabase;
