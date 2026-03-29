import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY } from '$env/static/public';

export async function handle({ event, resolve }) {
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    {
      cookies: {
        get: (key) => event.cookies.get(key),
        set: (key, value, options) => event.cookies.set(key, value, { ...options, path: '/' }),
        remove: (key, options) => event.cookies.delete(key, { ...options, path: '/' }),
      },
    }
  );

  const { data: { session } } = await event.locals.supabase.auth.getSession();
  event.locals.session = session;
  event.locals.user = session?.user ?? null;

  return resolve(event);
}