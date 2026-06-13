import Navbar from "@/components/shared/Navbar";

const activities = [
  "Writing articles and creative pieces",
  "Covering events through photography and media",
  "Designing visual identities and social media posts",
  "Creating podcasts and student conversations",
  "Documenting campus life at INSAT",
];

const board = [
  { role: "President", name: "Rima Ben Chaouacha", initials: "RBC" },
  { role: "Vice President", name: "Ranim Benzaied", initials: "RB" },
  { role: "Media Manager", name: "Mariem Maatoug", initials: "MM" },
  { role: "Media Manager", name: "Koussay Djebbi", initials: "KD" },
  { role: "Chief Photographer", name: "Mayssam Hergli", initials: "MH" },
  { role: "Head of Writing", name: "Iyed Ben Slimene", initials: "IBS" },
  { role: "RH", name: "Abdelkader Ben Hachena", initials: "ABH" },
  { role: "Treasurer", name: "Karem Amara", initials: "KA" },
];

const webmasters = [
  { name: "Israa Soudani", initials: "IS" },
  { name: "Mayssam Hergli", initials: "MH" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen page-bg">
      <Navbar />

      <section className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <h1 className="font-serif-display bg-[linear-gradient(90deg,#821b16_0%,#9e2d27_35%,#b9433a_65%,#d2766c_100%)] bg-clip-text pb-3 text-5xl font-bold leading-[1.08] text-transparent md:text-6xl lg:text-7xl">
              About Us
            </h1>

            <div className="mt-4 h-[1px] w-full bg-[var(--line)]" />
          </div>

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

              <h2 className="font-serif-display mt-3 text-4xl font-bold text-[var(--ink)]">
                Current team
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {board.map((member) => (
                <article
                  key={`${member.role}-${member.name}`}
                  className="rounded-xl border border-[var(--line)] bg-[rgba(255,248,243,0.24)] p-5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgba(33,25,22,0.06)]"
                >
                  <div className="mb-4 flex h-28 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--sand)]">
                    <span className="font-hand text-4xl font-bold text-[rgba(130,27,22,0.38)]">
                      {member.initials}
                    </span>
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
              <a href="#" className="btn-editorial">
                Facebook
              </a>

              <a href="#" className="btn-editorial">
                Instagram
              </a>

              <a href="#" className="btn-editorial">
                LinkedIn
              </a>
            </div>
          </section>

          <section className="mt-5 rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)] p-8 text-center md:p-10">
            <p className="font-hand text-5xl font-bold leading-none text-[var(--press-red)]">
              Webmasters
            </p>

            <h2 className="font-serif-display mt-3 text-4xl font-bold leading-tight text-[var(--ink)] md:text-5xl">
              Website made and mastered by
            </h2>

            <div className="mx-auto mt-7 grid max-w-2xl gap-4 sm:grid-cols-2">
              {webmasters.map((webmaster) => (
                <article
                  key={webmaster.name}
                  className="rounded-xl border border-[var(--line)] bg-[rgba(255,248,243,0.24)] p-5"
                >
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--sand)]">
                    <span className="font-hand text-4xl font-bold text-[rgba(130,27,22,0.38)]">
                      {webmaster.initials}
                    </span>
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