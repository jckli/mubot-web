import { NextResponse } from "next/server";
import { getScopes } from "../../../../lib/dashboard";
import {
  encodeScopeGrant,
  getSession,
  refreshSession,
  scopeGrantCookieName,
  setSessionCookie,
} from "../../../../lib/session";

export async function GET() {
  const current = await getSession();
  if (!current) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await refreshSession(current);
  if (!result) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const scopes = await getScopes(result.session);
    const response = NextResponse.json(scopes);
    if (result.refreshed) setSessionCookie(response, result.session);
    response.cookies.set(scopeGrantCookieName, encodeScopeGrant(result.session.userId, scopes.map((s) => s.scope)), {
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
