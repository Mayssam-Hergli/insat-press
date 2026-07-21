import Navbar from "@/components/shared/Navbar";
import PageTitle from "@/components/shared/PageTitle";
import WritingBrowser from "@/components/writing/WritingBrowser";
import { getPublishedArticles } from "@/lib/data/articles";

export default async function WritingPage() {
  const articles = await getPublishedArticles();
  const browserArticles = articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    description: article.description,
    category: article.category,
    coverImage: article.coverImage,
    coverLabel: article.coverLabel,
    displayDate: article.displayDate,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    writers: article.writers.map(({ profile }) => ({
      name: profile.fullName ?? profile.email,
    })),
  }));

  return (
    <main className="min-h-screen page-bg">
      <Navbar />

      <section className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <PageTitle title="Writing Department" />

          <p className="mb-8 max-w-2xl text-lg leading-8 text-[var(--muted)]">Ideas, investigations, and perspectives from the INSAT community.</p>
          <WritingBrowser articles={browserArticles} />
        </div>
      </section>
    </main>
  );
}
