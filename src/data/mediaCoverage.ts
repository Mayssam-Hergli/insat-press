export type GalleryImage = {
  id: string;
  label: string;
  src?: string;
  alt?: string;
};

export type MediaCoverage = {
  slug: string;
  title: string;
  eventName: string;
  date: string;
  description: string;
  coverLabel: string;
  coverImage?: string;
  type: string;
  content: string[];
  gallery: GalleryImage[];
};

export const mediaCoverage: MediaCoverage[] = [
  {
    slug: "data-overflow-coverage",
    title: "Data Overflow 7.0 Through Our Lens",
    eventName: "Data Overflow 7.0",
    date: "Coming soon",
    description:
      "A visual recap of workshops, talks, and moments captured by INSAT Press during Data Overflow.",
    coverLabel: "cover",
    type: "Event Coverage",
    content: [
      "This media coverage page will later contain a full recap of the event.",
      "The media team will be able to add photos, descriptions, and important moments from the dashboard.",
      "For now, this is placeholder content until real images are added.",
    ],
    gallery: [
      { id: "1", label: "photo 01" },
      { id: "2", label: "photo 02" },
      { id: "3", label: "photo 03" },
      { id: "4", label: "photo 04" },
      { id: "5", label: "photo 05" },
      { id: "6", label: "photo 06" },
      { id: "7", label: "photo 07" },
      { id: "8", label: "photo 08" },
      { id: "9", label: "photo 09" },
      { id: "10", label: "photo 10" },
    ],
  },
  {
    slug: "campus-moments",
    title: "Campus Moments",
    eventName: "INSAT Campus",
    date: "Coming soon",
    description:
      "A collection of everyday moments, creative frames, and visual stories from life at INSAT.",
    coverLabel: "cover",
    type: "Campus Life",
    content: [
      "Campus Moments is a visual archive of small scenes and memories from INSAT.",
      "Later, this page can include galleries, captions, and selected photos from the media team.",
    ],
    gallery: [
      { id: "1", label: "frame 01" },
      { id: "2", label: "frame 02" },
      { id: "3", label: "frame 03" },
      { id: "4", label: "frame 04" },
      { id: "5", label: "frame 05" },
      { id: "6", label: "frame 06" },
    ],
  },
  {
    slug: "behind-the-scenes",
    title: "Behind the Scenes",
    eventName: "INSAT Press",
    date: "Coming soon",
    description:
      "A look behind the camera: preparation, coverage, teamwork, and the creative process.",
    coverLabel: "cover",
    type: "Media Team",
    content: [
      "Behind the Scenes highlights the people and process behind INSAT Press coverage.",
      "This page will later show preparation photos, team moments, and media workflow snapshots.",
    ],
    gallery: [
      { id: "1", label: "bts 01" },
      { id: "2", label: "bts 02" },
      { id: "3", label: "bts 03" },
      { id: "4", label: "bts 04" },
      { id: "5", label: "bts 05" },
    ],
  },
];