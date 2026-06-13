import Navbar from "@/components/shared/Navbar";
import MediaCard from "@/components/cards/MediaCard";
import { mediaCoverage } from "@/data/mediaCoverage";

export default function MediaPage() {
  return (
    <main className="min-h-screen page-bg">
      <Navbar />

      <section className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <h1 className="font-serif-display bg-[linear-gradient(90deg,#821b16_0%,#9e2d27_35%,#b9433a_65%,#d2766c_100%)] bg-clip-text pb-3 text-5xl font-bold leading-[1.08] text-transparent md:text-6xl lg:text-7xl">
              Media Coverage
            </h1>

            <div className="mt-4 h-[1px] w-full bg-[var(--line)]" />
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {mediaCoverage.map((item) => (
              <MediaCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}