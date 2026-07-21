import { GrowthFeedEntryKind, GrowthIdeaStatus } from "@app-template/db";
import type { ProductGrowthFeedEntryModel } from "@app-template/db";

export type GrowthAgentDayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type GrowthAgentFeedItemType = "reddit" | "post" | "ad" | "newsjack";

export interface GrowthAgentTodo {
  id: string;
  text: string;
  done: boolean;
  hireUrl?: string;
}

export interface GrowthAgentFeedItem {
  id: string;
  day: GrowthAgentDayKey;
  type: GrowthAgentFeedItemType;
  tag: string;
  color: string;
  colorBg: string;
  title: string;
  meta: string;
  live?: boolean;
  defaultCompleted?: boolean;
  why?: string;
  quote?: string;
  reply?: string;
  threadUrl?: string;
  draftBody?: string;
  draftBodyX?: string;
  draftBodyLinkedIn?: string;
  headline?: string;
  body?: string;
  format?: string;
  platform?: string;
  budget?: string;
  creativeLabel?: string;
  isVideo?: boolean;
}

export interface GrowthAgentProject {
  id: string;
  type?: "ad";
  tag: string;
  color: string;
  colorBg: string;
  title: string;
  meta: string;
  defaultCompleted?: boolean;
  doneLabel?: string;
  isVideo?: boolean;
  description?: string;
  why?: string;
  headline?: string;
  body?: string;
  format?: string;
  platform?: string;
  budget?: string;
  creativeLabel?: string;
  todos: Array<GrowthAgentTodo>;
}

export interface GrowthAgentIdea {
  id: string;
  title: string;
  meta: string;
  description: string;
  why?: string;
  references?: Array<{ label: string; url: string }>;
  materials?: Array<{ label: string }>;
  todos: Array<GrowthAgentTodo>;
}

export interface GrowthAgentFeedData {
  feedItems: Array<GrowthAgentFeedItem>;
  ideas: Array<GrowthAgentIdea>;
  projects: Array<GrowthAgentProject>;
  ideaStatuses: Record<string, GrowthIdeaStatus>;
  todoDone: Record<string, boolean>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null && !Array.isArray(value);
}

function readString(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value : undefined;
}

function readBoolean(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "boolean" ? value : undefined;
}

function readTodos({
  payload,
  todoDone,
  entryId,
}: {
  payload: Record<string, unknown>;
  todoDone: Record<string, boolean>;
  entryId: string;
}) {
  const rawTodos = payload.todos;

  if (!Array.isArray(rawTodos)) {
    return [];
  }

  return rawTodos.flatMap((todo) => {
    if (!isRecord(todo)) {
      return [];
    }

    const id = readString(todo, "id");
    const text = readString(todo, "text");

    if (id == null || text == null) {
      return [];
    }

    const doneOverride = todoDone[`${entryId}:${id}`];
    const defaultDone = readBoolean(todo, "done") ?? false;
    const hireUrl = readString(todo, "hireUrl");

    return [
      {
        id,
        text,
        done: doneOverride != null ? doneOverride : defaultDone,
        hireUrl,
      },
    ];
  });
}

function mapFeedItem({
  entry,
  payload,
}: {
  entry: ProductGrowthFeedEntryModel;
  payload: Record<string, unknown>;
}): GrowthAgentFeedItem | null {
  const day = entry.dayKey;
  const type = readString(payload, "type");

  if (
    day !== "mon" &&
    day !== "tue" &&
    day !== "wed" &&
    day !== "thu" &&
    day !== "fri" &&
    day !== "sat" &&
    day !== "sun"
  ) {
    return null;
  }

  if (
    type !== "reddit" &&
    type !== "post" &&
    type !== "ad" &&
    type !== "newsjack"
  ) {
    return null;
  }

  const tag = readString(payload, "tag");
  const color = readString(payload, "color");
  const colorBg = readString(payload, "colorBg");
  const title = readString(payload, "title");
  const meta = readString(payload, "meta");

  if (tag == null || color == null || colorBg == null || title == null || meta == null) {
    return null;
  }

  return {
    id: entry.externalId,
    day,
    type,
    tag,
    color,
    colorBg,
    title,
    meta,
    live: readBoolean(payload, "live"),
    defaultCompleted: entry.completed,
    why: readString(payload, "why"),
    quote: readString(payload, "quote"),
    reply: readString(payload, "reply"),
    threadUrl: readString(payload, "threadUrl"),
    draftBody: readString(payload, "draftBody"),
    draftBodyX: readString(payload, "draftBodyX"),
    draftBodyLinkedIn: readString(payload, "draftBodyLinkedIn"),
    headline: readString(payload, "headline"),
    body: readString(payload, "body"),
    format: readString(payload, "format"),
    platform: readString(payload, "platform"),
    budget: readString(payload, "budget"),
    creativeLabel: readString(payload, "creativeLabel"),
    isVideo: readBoolean(payload, "isVideo"),
  };
}

function mapProject({
  entry,
  payload,
  todoDone,
}: {
  entry: ProductGrowthFeedEntryModel;
  payload: Record<string, unknown>;
  todoDone: Record<string, boolean>;
}): GrowthAgentProject | null {
  const tag = readString(payload, "tag");
  const color = readString(payload, "color");
  const colorBg = readString(payload, "colorBg");
  const title = readString(payload, "title");
  const meta = readString(payload, "meta");

  if (tag == null || color == null || colorBg == null || title == null || meta == null) {
    return null;
  }

  const projectType = readString(payload, "type");

  return {
    id: entry.externalId,
    type: projectType === "ad" ? "ad" : undefined,
    tag,
    color,
    colorBg,
    title,
    meta,
    defaultCompleted: entry.completed,
    doneLabel: readString(payload, "doneLabel"),
    isVideo: readBoolean(payload, "isVideo"),
    description: readString(payload, "description"),
    why: readString(payload, "why"),
    headline: readString(payload, "headline"),
    body: readString(payload, "body"),
    format: readString(payload, "format"),
    platform: readString(payload, "platform"),
    budget: readString(payload, "budget"),
    creativeLabel: readString(payload, "creativeLabel"),
    todos: readTodos({
      payload,
      todoDone,
      entryId: entry.externalId,
    }),
  };
}

function mapIdea({
  entry,
  payload,
  todoDone,
}: {
  entry: ProductGrowthFeedEntryModel;
  payload: Record<string, unknown>;
  todoDone: Record<string, boolean>;
}): GrowthAgentIdea | null {
  const title = readString(payload, "title");
  const meta = readString(payload, "meta");
  const description = readString(payload, "description");

  if (title == null || meta == null || description == null) {
    return null;
  }

  const references = Array.isArray(payload.references)
    ? payload.references.flatMap((reference) => {
        if (!isRecord(reference)) {
          return [];
        }

        const label = readString(reference, "label");
        const url = readString(reference, "url");

        if (label == null || url == null) {
          return [];
        }

        return [{ label, url }];
      })
    : undefined;

  const materials = Array.isArray(payload.materials)
    ? payload.materials.flatMap((material) => {
        if (!isRecord(material)) {
          return [];
        }

        const label = readString(material, "label");

        if (label == null) {
          return [];
        }

        return [{ label }];
      })
    : undefined;

  return {
    id: entry.externalId,
    title,
    meta,
    description,
    why: readString(payload, "why"),
    references,
    materials,
    todos: readTodos({
      payload,
      todoDone,
      entryId: entry.externalId,
    }),
  };
}

function readTodoDone(value: ProductGrowthFeedEntryModel["todoDone"]) {
  if (!isRecord(value)) {
    return {};
  }

  const todoDone: Record<string, boolean> = {};

  for (const [key, done] of Object.entries(value)) {
    if (typeof done === "boolean") {
      todoDone[key] = done;
    }
  }

  return todoDone;
}

export function mapGrowthFeedEntries(
  entries: Array<ProductGrowthFeedEntryModel>,
): GrowthAgentFeedData {
  const feedItems: Array<GrowthAgentFeedItem> = [];
  const ideas: Array<GrowthAgentIdea> = [];
  const projects: Array<GrowthAgentProject> = [];
  const ideaStatuses: Record<string, GrowthIdeaStatus> = {};
  const todoDone: Record<string, boolean> = {};

  for (const entry of entries) {
    if (!isRecord(entry.payload)) {
      continue;
    }

    const entryTodoDone = readTodoDone(entry.todoDone);
    Object.assign(todoDone, entryTodoDone);

    if (entry.kind === GrowthFeedEntryKind.FEED_ITEM) {
      const feedItem = mapFeedItem({ entry, payload: entry.payload });

      if (feedItem != null) {
        feedItems.push(feedItem);
      }
    }

    if (entry.kind === GrowthFeedEntryKind.IDEA) {
      const idea = mapIdea({
        entry,
        payload: entry.payload,
        todoDone: entryTodoDone,
      });

      if (idea != null) {
        ideas.push(idea);
        ideaStatuses[entry.externalId] = entry.ideaStatus ?? GrowthIdeaStatus.PENDING;
      }
    }

    if (entry.kind === GrowthFeedEntryKind.PROJECT) {
      const project = mapProject({
        entry,
        payload: entry.payload,
        todoDone: entryTodoDone,
      });

      if (project != null) {
        projects.push(project);
      }
    }
  }

  return {
    feedItems,
    ideas,
    projects,
    ideaStatuses,
    todoDone,
  };
}
