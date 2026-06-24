/* ============================================================================
   POISON PLANT FINDER — configuration
   ----------------------------------------------------------------------------
   To enable real accounts that sync across devices, create a free Supabase
   project (supabase.com), then paste your project URL and anon/public key
   below (Project Settings -> API). Until then the app runs in "guest mode"
   and saves everything in this browser.

   The anon key is safe to expose in front-end code — row-level security in
   Supabase (see supabase-schema.sql) keeps each user's data private.
   ============================================================================ */
window.PPF_CONFIG = {
  SUPABASE_URL: "",       // e.g. "https://abcdefgh.supabase.co"
  SUPABASE_ANON_KEY: "",  // e.g. "eyJhbGciOiJI...."
};
