import { NextRequest, NextResponse } from "next/server";
import { getMangaCards, getScopes, parseScope } from "../../../../lib/dashboard";
import { getSession } from "../../../../lib/session";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = parseScope(req.nextUrl.searchParams.get("scope"));
  if (!parsed) return NextResponse.json({ error: "Invalid scope" }, { status: 400 });

  const scopes = await getScopes(session).catch(() => []);
  if (!scopes.some((s) => s.scope === `${parsed.type}:${parsed.id}`)) {
    return NextResponse.json({ error: "Forbidden scope" }, { status: 403 });
  }
  try {
    return NextResponse.json(await getMangaCards(parsed.type, parsed.id));
  } catch {
    return NextResponse.json({ error: "Failed to load manga" }, { status: 500 });
  }
}
