import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | undefined;

export function getSupabaseAdminClient(): SupabaseClient {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL for Supabase admin access.");
  }
  if (!secret) {
    throw new Error(
      "Missing SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) for Supabase admin access."
    );
  }

  adminClient = createClient(url, secret, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return adminClient;
}

export async function inviteUserByEmail(email: string, redirectTo: string) {
  const { data, error } = await getSupabaseAdminClient().auth.admin.inviteUserByEmail(
    email,
    { redirectTo }
  );

  if (error) throw new Error(`Failed to invite user: ${error.message}`);
  return data.user;
}

export type AuthUserStatus = {
  lastSignInAt: string | null;
  emailConfirmedAt: string | null;
};

/** Pending = never signed in yet (invite not accepted). */
export async function getAuthUsersMap(): Promise<Map<string, AuthUserStatus>> {
  const { data, error } = await getSupabaseAdminClient().auth.admin.listUsers({
    perPage: 1000,
  });

  if (error) throw new Error(`Failed to list auth users: ${error.message}`);

  return new Map(
    data.users.map((user) => [
      user.id,
      {
        lastSignInAt: user.last_sign_in_at ?? null,
        emailConfirmedAt: user.email_confirmed_at ?? null,
      },
    ])
  );
}

export async function deleteAuthUser(id: string) {
  const { error } = await getSupabaseAdminClient().auth.admin.deleteUser(id);
  if (error && error.status !== 404) {
    throw new Error(`Failed to delete auth user: ${error.message}`);
  }
}

export async function updateAuthUserEmail(id: string, email: string) {
  const { error } = await getSupabaseAdminClient().auth.admin.updateUserById(id, {
    email,
  });
  if (error) throw new Error(`Failed to update auth user email: ${error.message}`);
}
