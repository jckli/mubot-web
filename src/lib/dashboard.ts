import { DashboardScope, MangaCard } from "./dashboard-types";
import { tsuuchiApiSecret, tsuuchiBase } from "./env";
import { UserSession } from "./session";

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

interface ConfiguredServersResponse {
  server_ids: string[];
}

interface TrackedManga {
  id: number;
  title: string;
  groupid?: number;
  groupName?: string;
}

interface MangaMetadata {
  id: number;
  title: string;
  author: string;
  cover_url: string | null;
}

const fetchJSON = async <T>(url: string, init?: RequestInit) => {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
};

const discordAvatar = (id: string, avatar: string | null, size = 64) =>
  avatar
    ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=${size}`
    : "https://cdn.discordapp.com/embed/avatars/0.png";

const guildIcon = (id: string, icon: string | null, size = 64) =>
  icon ? `https://cdn.discordapp.com/icons/${id}/${icon}.png?size=${size}` : null;

export const tsuuchiHeaders = () => {
  return { "x-api-key": tsuuchiApiSecret() };
};

export const getDiscordGuilds = (token: string) =>
  fetchJSON<DiscordGuild[]>("https://discord.com/api/v10/users/@me/guilds", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

const getConfiguredServerIds = async (serverIds: string[]) => {
  const data = await fetchJSON<ConfiguredServersResponse>(`${tsuuchiBase()}/servers/configured`, {
    method: "POST",
    headers: { ...tsuuchiHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ server_ids: serverIds }),
    cache: "no-store",
  });
  return new Set(data.server_ids);
};

export const getScopes = async (session: UserSession): Promise<DashboardScope[]> => {
  const guilds = await getDiscordGuilds(session.accessToken).catch(() => []);
  const configured = guilds.length
    ? await getConfiguredServerIds(guilds.map((g) => g.id)).catch(() => new Set<string>())
    : new Set<string>();
  return [
    {
      scope: `user:${session.userId}`,
      type: "user",
      id: session.userId,
      label: "Me",
      iconUrl: discordAvatar(session.userId, session.avatar),
    },
    ...guilds
      .filter((g) => configured.has(g.id))
      .map(
        (g) =>
          ({
            scope: `server:${g.id}`,
            type: "server",
            id: g.id,
            label: g.name,
            iconUrl: guildIcon(g.id, g.icon),
          }) satisfies DashboardScope,
      ),
  ];
};

export const parseScope = (scope: string | null | undefined) => {
  if (!scope) return null;
  const [type, id] = scope.split(":");
  if ((type !== "user" && type !== "server") || !id) return null;
  return { type, id } as { type: "user" | "server"; id: string };
};

const getWatchlist = (type: "user" | "server", id: string) =>
  fetchJSON<TrackedManga[]>(`${tsuuchiBase()}/${type}/${id}`, {
    headers: tsuuchiHeaders(),
    cache: "no-store",
  });

const getMangaMetadata = (ids: number[]) =>
  fetchJSON<MangaMetadata[]>(`${tsuuchiBase()}/manga/batch`, {
    method: "POST",
    headers: { ...tsuuchiHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
    cache: "no-store",
  });

const mangaUpdatesUrl = (id: number) => `https://www.mangaupdates.com/series/${id.toString(36)}`;

export const getMangaCards = async (
  type: "user" | "server",
  id: string,
): Promise<MangaCard[]> => {
  const list = await getWatchlist(type, id);
  if (!list.length) return [];
  const metadata = await getMangaMetadata(list.map((m) => m.id)).catch(() => []);
  const byId = new Map(metadata.map((m) => [m.id, m]));
  return list.map((m) => {
    const cached = byId.get(m.id);
    if (cached) {
      return {
        id: m.id,
        title: cached.title,
        author: cached.author,
        coverUrl: cached.cover_url,
        url: mangaUpdatesUrl(m.id),
        groupId: m.groupid,
        groupName: m.groupName,
      };
    }
    return {
      id: m.id,
      title: m.title,
      author: "Unknown author",
      coverUrl: null,
      url: mangaUpdatesUrl(m.id),
      groupId: m.groupid,
      groupName: m.groupName,
    };
  });
};
