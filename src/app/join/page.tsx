import Navbar from "@/components/shared/Navbar";
import PageTitle from "@/components/shared/PageTitle";
import { siteConfig } from "@/data/siteConfig";

const inputClass =
  "w-full rounded-xl border border-[var(--line)] bg-[rgba(255,248,243,0.38)] px-4 py-3 text-sm font-semibold text-[var(--ink)] outline-none transition placeholder:text-[rgba(106,85,77,0.55)] focus:border-[var(--press-red)] disabled:cursor-not-allowed disabled:opacity-55";

const labelClass =
  "mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]";

const descriptionClass =
  "text-lg font-semibold leading-8 text-[var(--ink)] md:text-xl";

export default function JoinPage() {
  const recruitmentOpen = siteConfig.recruitment.open;

  return (
    <main className="min-h-screen page-bg">
      <Navbar />

      <section className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <PageTitle title="Join Us" />

          {!recruitmentOpen && (
            <section className="mb-5 rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.32)] p-6 text-center md:p-8">
              <p className="font-hand text-5xl font-bold leading-none text-[var(--press-red)]">
                Recruitment is currently closed
              </p>

              <p className={`mx-auto mt-4 max-w-2xl ${descriptionClass}`}>
                {siteConfig.recruitment.closedMessage}
              </p>
            </section>
          )}

          <section className="rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)] p-6 md:p-8">
            <div className="mb-7">
              <p className="font-hand text-5xl font-bold leading-none text-[var(--press-red)]">
                Application form
              </p>

              <p className={`mt-3 max-w-2xl ${descriptionClass}`}>
                Fill in your information and tell us why you want to join INSAT
                Press.
              </p>
            </div>

            <form className="space-y-5">
              <fieldset
                disabled={!recruitmentOpen}
                className="grid gap-5 md:grid-cols-2"
              >
                <div>
                  <label className={labelClass} htmlFor="fullName">
                    Full name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="email">
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="phone">
                    Phone
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="Your phone number"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="majorYear">
                    INSAT major and year
                  </label>

                  <input
                    id="majorYear"
                    name="majorYear"
                    type="text"
                    required
                    placeholder="Example: GL2, RT1, IIA2..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="department">
                    Department of interest
                  </label>

                  <select
                    id="department"
                    name="department"
                    required
                    className={inputClass}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Choose a department
                    </option>

                    {siteConfig.departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass} htmlFor="portfolio">
                    Portfolio link{" "}
                    <span className="normal-case tracking-normal text-[var(--muted)]">
                      optional
                    </span>
                  </label>

                  <input
                    id="portfolio"
                    name="portfolio"
                    type="url"
                    placeholder="Behance, Drive, Instagram, GitHub..."
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="motivation">
                    Motivation
                  </label>

                  <textarea
                    id="motivation"
                    name="motivation"
                    required
                    rows={6}
                    placeholder="Tell us why you want to join INSAT Press..."
                    className={inputClass}
                  />
                </div>
              </fieldset>

              <div className="flex flex-col items-start gap-3 border-t border-[var(--line)] pt-5 md:flex-row md:items-center md:justify-between">
                <p className="text-base font-semibold leading-7 text-[var(--ink)]">
                  {recruitmentOpen
                    ? "Recruitment is open. You can submit your application."
                    : "Recruitment is closed. The form is currently disabled."}
                </p>

                {recruitmentOpen && (
                  <button type="submit" className="btn-editorial">
                    Submit application
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}