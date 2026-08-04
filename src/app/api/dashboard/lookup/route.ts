import { NextRequest, NextResponse } from "next/server";
import { getManagementState, lookup } from "../../../../lib/dashboard-access";
import { getSession, refreshSession, setSessionCookie } from "../../../../lib/session";

const searchPath = (kind: string, q: string, mangaId: string | null, serverId: string | null) => {
  if (kind === "manga" && q.length >= 2) return `/manga/search?q=${encodeURIComponent(q)}`;
  if (kind === "metadata" && mangaId && /^\d+$/.test(mangaId)) return `/manga/${mangaId}`;
  if (kind === "groups" && mangaId && /^\d+$/.test(mangaId)) return `/manga/${mangaId}/groups`;
  if (kind === "roles" && serverId && /^\d+$/.test(serverId)) return `/server/${serverId}/roles`;
  return null;
};

export async function GET(req: NextRequest) {
  const current = await getSession();
  const session = current && await refreshSession(current);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const scope = req.nextUrl.searchParams.get("scope") || "";
  const kind = req.nextUrl.searchParams.get("kind") || "";
  const serverId = req.nextUrl.searchParams.get("serverId");
  const path = searchPath(kind, (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 80), req.nextUrl.searchParams.get("mangaId"), req.nextUrl.searchParams.get("serverId"));
  if (!path || (kind === "roles" && scope !== `server:${serverId}`)) return NextResponse.json({ error: "Invalid lookup" }, { status: 400 });
  try {
    const access = await getManagementState(session.session, scope);
    if (!access.canEdit && kind !== "metadata") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const response = NextResponse.json(await lookup(path));
    if (session.refreshed) setSessionCookie(response, session.session);
    return response;
  } catch {
    return NextResponse.json({ error: "Lookup unavailable" }, { status: 500 });
  }
}
