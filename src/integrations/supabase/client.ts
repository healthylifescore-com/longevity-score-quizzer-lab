// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qxxlojgqqwevhhnxscqz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4eGxvamdxcXdldmhobnhzY3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDA5MDEsImV4cCI6MjA2NzM3NjkwMX0.oL_LNC8If4Bz9j40yhQTjYx7toKmFka4zsQCBVv6cmQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});