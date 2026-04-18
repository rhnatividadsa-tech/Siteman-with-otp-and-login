const STORAGE_KEY = "bayanihub.supabase.session";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export interface StoredSession {
  accessToken: string;
  refreshToken: string;
  email: string;
}

export interface RecoverySession {
  accessToken: string;
  refreshToken: string;
  type: string;
}

function getSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Missing Supabase environment variables. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    );
  }

  return {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
  };
}

async function parseSupabaseResponse(response: Response) {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.msg ||
        payload?.error_description ||
        payload?.error ||
        "Supabase request failed.",
    );
  }

  return payload;
}

function ensureBrowser() {
  if (typeof window === "undefined") {
    throw new Error("This action must run in the browser.");
  }
}

export async function signInWithPassword(email: string, password: string) {
  const { url, anonKey } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim(),
      password,
    }),
  });

  const payload = await parseSupabaseResponse(response);
  saveSession({
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    email: payload.user?.email ?? email.trim(),
  });

  return payload;
}

export async function sendPasswordRecovery(email: string) {
  ensureBrowser();
  const { url, anonKey } = getSupabaseConfig();
  const redirectTo = `${window.location.origin}/`;

  const response = await fetch(`${url}/auth/v1/recover`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim(),
      redirect_to: redirectTo,
    }),
  });

  return parseSupabaseResponse(response);
}

export async function updatePassword(accessToken: string, password: string) {
  const { url, anonKey } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/user`, {
    method: "PUT",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password,
    }),
  });

  return parseSupabaseResponse(response);
}

export function saveSession(session: StoredSession) {
  ensureBrowser();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function getStoredSession(): StoredSession | null {
  ensureBrowser();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearStoredSession() {
  ensureBrowser();
  window.localStorage.removeItem(STORAGE_KEY);
}
