import "server-only";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing Supabase admin environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  );
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function inviteUserByEmail(email: string, redirectTo: string) {
  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    redirectTo,
  });

  if (error) {
    throw new Error(`Failed to invite user: ${error.message}`);
  }

  return data.user;
}

export type AuthUserStatus = {
  lastSignInAt: string | null;
  emailConfirmedAt: string | null;
};

/** Pending = never signed in yet (invite not accepted). */
export async function getAuthUsersMap(): Promise<Map<string, AuthUserStatus>> {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    perPage: 1000,
  });

  if (error) {
    throw new Error(`Failed to list auth users: ${error.message}`);
  }

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
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error && error.status !== 404) {
    throw new Error(`Failed to delete auth user: ${error.message}`);
  }
}

export async function updateAuthUserEmail(id: string, email: string) {
  const { error } = await supabaseAdmin.auth.admin.updateUserById(id, { email });

  if (error) {
    throw new Error(`Failed to update auth user email: ${error.message}`);
  }
}
