import { DashboardScope, MangaCard } from "./dashboard-types";
import { tsuuchiApiSecret, tsuuchiBase } from "./env";
import { UserSession } from "./session";

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
}

interface TrackedManga {
  id: number;
  title: string;
}

interface MangaDetails {
  id: number;
  title: string;
  url: string;
  image?: { url?: { original?: string; thumb?: string } };
  authors?: { name: string; type: string }[];
}

const fetchJSON = async <T>(url: string, init?: RequestInit) => {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
};

const mapLimit = async <T, R>(
  arr: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
) => {
  const out = new Array<R>(arr.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, arr.length) }, async () => {
      for (;;) {
        const idx = i++;
        if (idx >= arr.length) return;
        out[idx] = await fn(arr[idx]);
      }
    }),
  );
  return out;
};

const discordAvatar = (id: string, avatar: string | null, size = 128) =>
  avatar
    ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=${size}`
    : "https://cdn.discordapp.com/embed/avatars/0.png";

const guildIcon = (id: string, icon: string | null, size = 128) =>
  icon ? `https://cdn.discordapp.com/icons/${id}/${icon}.png?size=${size}` : null;

const tsuuchiHeaders = () => {
  return { "x-api-key": tsuuchiApiSecret() };
};

const getDiscordGuilds = (token: string) =>
  fetchJSON<DiscordGuild[]>("https://discord.com/api/v10/users/@me/guilds", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

const hasServerConfig = async (serverId: string) => {
  const res = await fetch(`${tsuuchiBase()}/server/${serverId}/config`, {
    headers: tsuuchiHeaders(),
    cache: "no-store",
  });
  return res.ok;
};

export const getScopes = async (session: UserSession): Promise<DashboardScope[]> => {
  const guilds = await getDiscordGuilds(session.accessToken).catch(() => []);
  const checks = await mapLimit<DiscordGuild, DashboardScope | null>(guilds, 8, async (g) =>
    (await hasServerConfig(g.id))
      ? ({
          scope: `server:${g.id}`,
          type: "server",
          id: g.id,
          label: g.name,
          iconUrl: guildIcon(g.id, g.icon),
        } satisfies DashboardScope)
      : null,
  );
  return [
    {
      scope: `user:${session.userId}`,
      type: "user",
      id: session.userId,
      label: "Me",
      iconUrl: discordAvatar(session.userId, session.avatar),
    },
    ...checks.filter((v): v is DashboardScope => !!v),
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

const getMangaDetails = (id: number) =>
  fetchJSON<MangaDetails>(`${tsuuchiBase()}/manga/${id}`, {
    headers: tsuuchiHeaders(),
    cache: "force-cache",
    next: { revalidate: 300 },
  });

export const getMangaCards = async (
  type: "user" | "server",
  id: string,
): Promise<MangaCard[]> => {
  const list = await getWatchlist(type, id);
  if (!list.length) return [];
  return mapLimit(list, 10, async (m) => {
    const details = await getMangaDetails(m.id).catch(() => null);
    const author =
      details?.authors?.find((a) => a.type.toLowerCase() === "author")?.name ||
      details?.authors?.[0]?.name ||
      "Unknown author";
    return {
      id: m.id,
      title: details?.title || m.title,
      author,
      coverUrl: details?.image?.url?.thumb || details?.image?.url?.original || null,
      url: details?.url || `https://www.mangaupdates.com/series/${m.id}`,
    };
  });
};
