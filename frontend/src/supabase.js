import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gcxpgwywpesalfbkeakm.supabase.co';
const supabaseAnonKey = 'sb_publishable_MPtdrG6UHTiT82o78y2GJQ_oML-dacm';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
