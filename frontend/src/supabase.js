import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://khrthwtylnklbceixkuu.supabase.co';
const supabaseAnonKey = 'sb_publishable_MH4DRziI5ud34TnTRZANiw_5Z6Qdud0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
