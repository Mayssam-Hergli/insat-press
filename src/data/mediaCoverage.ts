
export type MediaCoverage = {
  slug: string;
  title: string;
  eventName: string;
  date: string;
  description: string;
  coverLabel: string;
  type: string;
};

export const mediaCoverage: MediaCoverage[] = [
  {
    slug: "data-overflow-coverage",
    title: "Data Overflow 7.0 Through Our Lens",
    eventName: "Data Overflow 7.0",
    date: "Coming soon",
    description:
      "A visual recap of workshops, talks, and moments captured by INSAT Press during Data Overflow.",
    coverLabel: "shots",
    type: "Event Coverage",
  },
  {
    slug: "campus-moments",
    title: "Campus Moments",
    eventName: "INSAT Campus",
    date: "Coming soon",
    description:
      "A collection of everyday moments, creative frames, and visual stories from life at INSAT.",
    coverLabel: "photo",
    type: "Campus Life",
  },
  {
    slug: "behind-the-scenes",
    title: "Behind the Scenes",
    eventName: "INSAT Press",
    date: "Coming soon",
    description:
      "A look behind the camera: preparation, coverage, teamwork, and the creative process.",
    coverLabel: "bts",
    type: "Media Team",
  },
];