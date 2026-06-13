export type EventItem = {
  slug: string;
  title: string;
  edition: string;
  date: string;
  description: string;
  coverLabel: string;
  type: string;
};

export const events: EventItem[] = [
  {
    slug: "press-night",
    title: "INSAT Press Night",
    edition: "Annual Event",
    date: "Coming soon",
    description:
      "A signature INSAT Press event celebrating creativity, expression, media, and storytelling.",
    coverLabel: "night",
    type: "Flagship Event",
  },
  {
    slug: "creative-workshops",
    title: "Creative Workshops",
    edition: "Recurring Activity",
    date: "Coming soon",
    description:
      "Workshops around writing, photography, design, media coverage, and content creation.",
    coverLabel: "create",
    type: "Workshop",
  },
  {
    slug: "campus-coverage-days",
    title: "Campus Coverage Days",
    edition: "Media Activity",
    date: "Coming soon",
    description:
      "INSAT Press moments dedicated to capturing events, student life, and campus memories.",
    coverLabel: "cover",
    type: "Coverage",
  },
];