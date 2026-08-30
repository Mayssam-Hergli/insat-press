import {
  ContentStatus,
  type Event,
  type Prisma,
} from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import {
  runDataQuery,
  toBigIntId,
  type EntityId,
  type PaginationOptions,
} from "./utils";

const eventOrderBy = [
  { startsAt: "desc" },
  { publishedAt: "desc" },
  { createdAt: "desc" },
] satisfies Prisma.EventOrderByWithRelationInput[];

const eventWithEditorsInclude = {
  createdBy: true,
  updatedBy: true,
} satisfies Prisma.EventInclude;

export type EventWithEditors = Prisma.EventGetPayload<{
  include: typeof eventWithEditorsInclude;
}>;

export type EventFilters = PaginationOptions & {
  status?: ContentStatus;
  type?: string;
};

export function getAllEvents(
  filters: EventFilters = {}
): Promise<EventWithEditors[]> {
  return runDataQuery("get all events", () =>
    getPrisma().event.findMany({
      where: {
        status: filters.status,
        type: filters.type,
      },
      include: eventWithEditorsInclude,
      orderBy: eventOrderBy,
      skip: filters.skip,
      take: filters.take,
    })
  );
}

export function getPublishedEvents(
  options: PaginationOptions = {}
): Promise<EventWithEditors[]> {
  return getAllEvents({ ...options, status: ContentStatus.PUBLISHED });
}

export function getEventById(id: EntityId): Promise<EventWithEditors | null> {
  return runDataQuery(`get event by id ${String(id)}`, () =>
    getPrisma().event.findUnique({
      where: { id: toBigIntId(id) },
      include: eventWithEditorsInclude,
    })
  );
}

export function getEventBySlug(slug: string): Promise<EventWithEditors | null> {
  return runDataQuery(`get event by slug ${slug}`, () =>
    getPrisma().event.findUnique({
      where: { slug },
      include: eventWithEditorsInclude,
    })
  );
}

export function getEventByTitle(title: string): Promise<EventWithEditors | null> {
  return runDataQuery(`get event by title ${title}`, () =>
    getPrisma().event.findFirst({
      where: { title },
      include: eventWithEditorsInclude,
      orderBy: eventOrderBy,
    })
  );
}

export function createEvent(data: Prisma.EventCreateInput): Promise<Event> {
  return runDataQuery("create event", () => getPrisma().event.create({ data }));
}

export function updateEvent(
  id: EntityId,
  data: Prisma.EventUpdateInput
): Promise<Event> {
  return runDataQuery(`update event ${String(id)}`, () =>
    getPrisma().event.update({ where: { id: toBigIntId(id) }, data })
  );
}

export function publishEvent(
  id: EntityId,
  publishedAt = new Date()
): Promise<Event> {
  return updateEvent(id, {
    status: ContentStatus.PUBLISHED,
    publishedAt,
  });
}

export function archiveEvent(id: EntityId): Promise<Event> {
  return updateEvent(id, {
    status: ContentStatus.ARCHIVED,
  });
}

export function deleteEvent(id: EntityId): Promise<Event> {
  return runDataQuery(`delete event ${String(id)}`, () =>
    getPrisma().event.delete({ where: { id: toBigIntId(id) } })
  );
}
