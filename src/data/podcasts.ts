export type PodcastEpisode = {
  slug: string;
  title: string;
  host: string;
  guest: string;
  date: string;
  description: string;
  coverLabel: string;
  youtubeUrl: string;
  spotifyUrl: string;
};

export const podcasts: PodcastEpisode[] = [
  {
    slug: "behind-the-press",
    title: "Behind the Press",
    host: "INSAT Press Podcast Team",
    guest: "INSAT Press Members",
    date: "Coming soon",
    description:
      "A first conversation about creativity, storytelling, and what happens behind INSAT Press.",
    coverLabel: "talk",
    youtubeUrl: "#",
    spotifyUrl: "#",
  },
  {
    slug: "campus-voices",
    title: "Campus Voices",
    host: "Podcast Department",
    guest: "INSAT Students",
    date: "Coming soon",
    description:
      "A chill episode featuring student opinions, campus stories, and spontaneous conversations.",
    coverLabel: "voice",
    youtubeUrl: "#",
    spotifyUrl: "#",
  },
  {
    slug: "creative-process",
    title: "The Creative Process",
    host: "INSAT Press",
    guest: "Creative Team",
    date: "Coming soon",
    description:
      "An episode about writing, design, photography, and how ideas turn into published content.",
    coverLabel: "audio",
    youtubeUrl: "#",
    spotifyUrl: "#",
  },
];