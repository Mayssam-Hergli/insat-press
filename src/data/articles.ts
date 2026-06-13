export type Article = {
  slug: string;
  title: string;
  writer: string;
  date: string;
  description: string;
  category: string;
  coverLabel: string;
  content: string[];
};

export const articles: Article[] = [
  {
    slug: "voice-behind-the-words",
    title: "The Voice Behind the Words",
    writer: "INSAT Press Writer",
    date: "Coming soon",
    description:
      "A first glimpse into the weekly editorial pieces that will shape the new digital identity of INSAT Press.",
    category: "Editorial",
    coverLabel: "press",
    content: [
      "This is a placeholder article for the INSAT Press writing section.",
      "Later, this page will contain the full article content added by the writing manager or publisher through the admin dashboard.",
      "The article will support a cover image, writer name, date, description, category, source link, and full content.",
    ],
  },
  {
    slug: "campus-stories",
    title: "Campus Stories",
    writer: "Writing Department",
    date: "Coming soon",
    description:
      "Stories, opinions, and reflections from the INSAT community, written with a creative editorial spirit.",
    category: "Campus Life",
    coverLabel: "story",
    content: [
      "This is a second placeholder article.",
      "The real website will display articles from latest to oldest, similar to a simple editorial platform.",
      "Each article will have its own full page with a readable layout.",
    ],
  },
  {
    slug: "between-ink-and-campus",
    title: "Between Ink and Campus",
    writer: "INSAT Press Team",
    date: "Coming soon",
    description:
      "A creative piece about student life, expression, and the role of writing in documenting memories.",
    category: "Creative Writing",
    coverLabel: "ink",
    content: [
      "This is a third placeholder article.",
      "We are using mock content for now until the database and admin dashboard are connected.",
      "Later, imported Facebook articles will also keep their original author, original date, and source link.",
    ],
  },
  {
    slug: "the-art-of-noticing",
    title: "The Art of Noticing",
    writer: "INSAT Press Writer",
    date: "Coming soon",
    description:
      "A short reflection on paying attention to the small details that shape campus life.",
    category: "Reflection",
    coverLabel: "notice",
    content: [
      "This is a placeholder article.",
      "Later, this will become a full article page.",
    ],
  },
  {
    slug: "why-we-write",
    title: "Why We Write",
    writer: "Writing Department",
    date: "Coming soon",
    description:
      "An editorial piece about writing as memory, expression, and student identity.",
    category: "Editorial",
    coverLabel: "write",
    content: [
      "This is a placeholder article.",
      "Later, this will become a full article page.",
    ],
  },
  {
    slug: "campus-through-words",
    title: "Campus Through Words",
    writer: "INSAT Press Team",
    date: "Coming soon",
    description:
      "A creative look at how words can document the energy and rhythm of INSAT.",
    category: "Campus Life",
    coverLabel: "words",
    content: [
      "This is a placeholder article.",
      "Later, this will become a full article page.",
    ],
  },
  {
    slug: "from-idea-to-article",
    title: "From Idea to Article",
    writer: "Writing Department",
    date: "Coming soon",
    description:
      "A simple piece about how an idea becomes a polished article at INSAT Press.",
    category: "Writing",
    coverLabel: "draft",
    content: [
      "This is a placeholder article.",
      "Later, this will become a full article page.",
    ],
  },
];