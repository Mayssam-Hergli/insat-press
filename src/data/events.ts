export type EventItem = {
  slug: string;
  title: string;
  edition: string;
  date: string;
  description: string;
  coverLabel: string;
  coverImage?: string;
  type: string;
  // paragraphs shown on the detail page
  content: string[];
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
    content: [
      "INSAT Press Night is our flagship annual event, bringing together the entire club and the INSAT community for a night of creative celebration.",
      "The event features live performances, media showcases, writing readings, and highlights from the year's work across all departments.",
      "More details about the upcoming edition will be published here soon.",
    ],
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
    content: [
      "Creative Workshops are recurring sessions where INSAT Press members and interested students develop practical skills across all club departments.",
      "Sessions cover writing techniques, photography composition, design principles, media coverage planning, and content creation workflows.",
      "Workshop dates and topics are announced on our social media. Follow us to stay updated.",
    ],
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
    content: [
      "Campus Coverage Days are dedicated sessions where the INSAT Press media and photography teams go out to document campus life.",
      "These sessions produce the visual content that fills our media coverage galleries and social media feeds.",
      "Coverage day schedules are coordinated with campus events and announced in advance.",
    ],
  },
];
