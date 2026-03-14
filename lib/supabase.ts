import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://kkbobdoymvhebusrjcou.supabase.co"
const supabaseKey = "sb_publishable_nKo1OA9sJgSWY5qbxlUX9A_3eHpstql"

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)