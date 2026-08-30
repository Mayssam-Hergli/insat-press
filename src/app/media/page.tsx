import Navbar from "@/components/shared/Navbar";
import PageTitle from "@/components/shared/PageTitle";
import MediaCard from "@/components/cards/MediaCard";
import { getAllMediaCoverage } from "@/lib/data/mediaCoverage";

export default async function MediaPage() {
  const mediaCoverage = await getAllMediaCoverage();
  return (
    <main className="min-h-screen page-bg">
      <Navbar />

      <section className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <PageTitle title="Media Coverage" />

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