import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ojhlecytqripddoxocvm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_snFonx3kD9xUJeqVt9z2-w_9GTDqIhl';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);