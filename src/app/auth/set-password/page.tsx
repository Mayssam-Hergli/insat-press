import { getCurrentUser } from "@/lib/auth/session";
import SetPasswordForm from "@/components/admin/SetPasswordForm";

export default async function SetPasswordPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen page-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-black tracking-tight text-[var(--ink)]">
          insat <span className="text-[var(--press-red)]">press</span>
        </h1>
        <h2 className="mt-6 text-center font-serif-display text-2xl font-bold text-[var(--ink)]">
          Set Your Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="paper-card rounded-[1.2rem] py-8 px-4 sm:px-10">
          {user ? (
            <SetPasswordForm />
          ) : (
            <div className="text-center">
              <p className="text-[var(--muted)]">
                This invite link has expired or was already used. Ask an
                admin to resend your invite from the Team section.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
