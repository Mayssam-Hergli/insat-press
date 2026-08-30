import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import PageTitle from "@/components/shared/PageTitle";
import { siteConfig } from "@/data/siteConfig";
const activities = [
  "Writing articles and creative pieces",
  "Covering events through photography and media",
  "Designing visual identities and social media posts",
  "Creating podcasts and student conversations",
  "Documenting campus life at INSAT",
];

const board = [
  { role: "President", name: "Rima Ben Chaouacha", initials: "RBC", photo: "/team/rima-ben-chaoucha.jpg" },
  { role: "Vice President", name: "Ranim Benzaied", initials: "RB", photo: "/team/ranim-ben-zaied.jpg" },
  { role: "Media Manager", name: "Mariem Maatoug", initials: "MM", photo: "/team/mariem-maatoug.jpg" },
  { role: "Media Manager", name: "Koussay Djebbi", initials: "KD", photo: "/team/koussay-djebbi.jpg" },
  { role: "Chief Photographer", name: "Mayssam Hergli", initials: "MH", photo: "/team/mayssam-hergli.jpg" },
  { role: "Head of Writing", name: "Iyed BenSlimen", initials: "IBS", photo: "/team/iyed-benslimen.jpg" },
  { role: "RH", name: "Abdelkader Hachena", initials: "ABH", photo: "/team/abdelkader-ben-hachena.jpg" },
  { role: "Treasurer", name: "Karem Amara", initials: "KA", photo: "/team/karem-amara.jpg" },
  { role: "General Secretary", name: "Mohammed Graja", initials: "MG", photo: "/team/mohammed-graja.jpg" },
];

const webmasters = [
  { name: "Mayssam Hergli", initials: "MH", photo: "/webmasters/mayssam-hergli.jpeg" },
  { name: "Israa Soudani", initials: "IS", photo: "/webmasters/israa-soudani.jpeg" },
  { name: "Moataz Zouari", initials: "MZ", photo: "/webmasters/taz.jpg" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen page-bg">
      <Navbar />

      <section className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
         <PageTitle title="About Us" />
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)] p-6 md:p-8">
              <p className="font-hand text-5xl font-bold leading-none text-[var(--press-red)]">
                Who we are
              </p>

              <h2 className="font-serif-display mt-5 text-4xl font-bold leading-tight text-[var(--ink)] md:text-5xl">
                The creative voice of INSAT.
              </h2>

              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] md:text-lg">
                INSAT Press is a creative student club dedicated to storytelling,
                writing, photography, design, journalism, and podcasting. We
                capture campus life, document events, and give students a space
                to express ideas with style and purpose.
              </p>
            </section>

            <section className="rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)] p-6 md:p-8">
              <p className="font-hand text-5xl font-bold leading-none text-[var(--press-red)]">
                What we do
              </p>

              <div className="mt-6 space-y-3">
                {activities.map((activity) => (
                  <div
                    key={activity}
                    className="rounded-xl border border-[var(--line)] bg-[rgba(255,248,243,0.22)] px-4 py-3 text-sm font-semibold text-[var(--muted)]"
                  >
                    {activity}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-5 rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)] p-6 md:p-8">
            <div className="mb-7">
              <p className="font-hand text-5xl font-bold leading-none text-[var(--press-red)]">
                Executive board
              </p>

             
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {board.map((member) => (
                <article
                  key={`${member.role}-${member.name}`}
                  className="rounded-xl border border-[var(--line)] bg-[rgba(255,248,243,0.24)] p-5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgba(33,25,22,0.06)]"
                >
                  <div className="relative mb-4 h-52 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--sand)]">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center font-hand text-4xl font-bold text-[rgba(130,27,22,0.38)]">
                        {member.initials}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                    {member.role}
                  </p>

                  <h3 className="mt-3 text-xl font-black leading-tight text-[var(--ink)]">
                    {member.name}
                  </h3>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)] p-8 text-center md:p-10">
            <p className="font-hand text-5xl font-bold leading-none text-[var(--press-red)]">
              Follow us
            </p>

            <h2 className="font-serif-display mx-auto mt-3 max-w-2xl text-4xl font-bold leading-tight text-[var(--ink)] md:text-5xl">
              Stay connected with INSAT Press.
            </h2>

            <div className="mt-7 flex flex-wrap justify-center gap-4">
              {siteConfig.socialLinks.map((link) => (
                <a key={link.label} href={link.href} className="btn-editorial">
                  {link.label}
                </a>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)] p-8 text-center md:p-10">
            <p className="font-hand text-5xl font-bold leading-none text-[var(--press-red)]">
              Webmasters
            </p>

            <h2 className="font-serif-display mt-3 text-4xl font-bold leading-tight text-[var(--ink)] md:text-5xl">
              Website made and mastered by
            </h2>

            <div className="mx-auto mt-7 grid max-w-3xl gap-4 sm:grid-cols-3">
              {webmasters.map((webmaster) => (
                <article
                  key={webmaster.name}
                  className="rounded-xl border border-[var(--line)] bg-[rgba(255,248,243,0.24)] p-5"
                >
                  <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border border-[var(--line)] bg-[var(--sand)]">
                    {webmaster.photo ? (
                      <Image
                        src={webmaster.photo}
                        alt={webmaster.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center font-hand text-4xl font-bold text-[rgba(130,27,22,0.38)]">
                        {webmaster.initials}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-[var(--ink)]">
                    {webmaster.name}
                  </h3>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}