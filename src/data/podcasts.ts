export type PodcastEpisode = {
  slug: string;
  title: string;
  host: string;
  guest: string;
  date: string;
  description: string;
  coverLabel: string;
  coverImage?: string;
  youtubeUrl: string;
  spotifyUrl: string;
  // show notes shown on the detail page
  content: string[];
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
    content: [
      "In this episode, we sit down with members of INSAT Press to talk about the club's creative process, day-to-day work, and what makes each department unique.",
      "Topics include how the writing team approaches articles, how the media team plans coverage, and what it's like to be part of a student press club.",
      "Full episode available on YouTube and Spotify.",
    ],
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
    content: [
      "Campus Voices captures unscripted conversations with INSAT students about campus life, academic experiences, and student perspectives.",
      "Each episode features a different mix of guests, keeping the format fresh and the conversations genuine.",
      "Listen on YouTube or Spotify.",
    ],
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
    content: [
      "This episode dives into how raw ideas become finished pieces of content — from the first draft of an article to the final edit of a photo album.",
      "Members from the writing, design, and photography departments share their workflows and creative philosophy.",
      "Available on YouTube and Spotify.",
    ],
  },
];
