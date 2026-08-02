import { NextResponse } from "next/server";
import { getScopes } from "../../../../lib/dashboard";
import { encodeScopeGrant, getSession, scopeGrantCookieName } from "../../../../lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const scopes = await getScopes(session);
    const response = NextResponse.json(scopes);
    response.cookies.set(scopeGrantCookieName, encodeScopeGrant(session.userId, scopes.map((s) => s.scope)), {
      httpOnly: true,
      maxAge: 120,
      path: "/api/dashboard",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Failed to load scopes" }, { status: 500 });
  }
}
