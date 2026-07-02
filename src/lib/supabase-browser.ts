import { createBrowserClient } from "@supabase/ssr";

// Client Supabase untuk dipakai di Client Component ("use client").
// Auth (login/register/logout) jalan lewat sini.
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase belum dikonfigurasi. Set NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di Environment Variables Vercel (Project Settings → Environment Variables), lalu redeploy."
    );
  }

  return createBrowserClient(url, key);
}
