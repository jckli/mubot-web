import { NextRequest, NextResponse } from "next/server";
import { getMangaCards, getScopes, parseScope } from "../../../../lib/dashboard";
import {
  encodeScopeGrant,
  getScopeGrant,
  getSession,
  scopeGrantCookieName,
} from "../../../../lib/session";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = parseScope(req.nextUrl.searchParams.get("scope"));
  if (!parsed) return NextResponse.json({ error: "Invalid scope" }, { status: 400 });

  const requested = `${parsed.type}:${parsed.id}`;
  let grant = await getScopeGrant(session.userId);
  let refreshedScopes: string[] | null = null;
  if (!grant) {
    refreshedScopes = (await getScopes(session).catch(() => [])).map((s) => s.scope);
    grant = new Set(refreshedScopes);
  }
  if (!grant.has(requested)) {
    return NextResponse.json({ error: "Forbidden scope" }, { status: 403 });
  }
  try {
    const response = NextResponse.json(await getMangaCards(parsed.type, parsed.id));
    if (refreshedScopes) {
      response.cookies.set(scopeGrantCookieName, encodeScopeGrant(session.userId, refreshedScopes), {
        httpOnly: true,
        maxAge: 120,
        path: "/api/dashboard",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }
    return response;
  } catch {
    return NextResponse.json({ error: "Failed to load manga" }, { status: 500 });
  }
}
