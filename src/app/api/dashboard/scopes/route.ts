import { NextResponse } from "next/server";
import { getScopes } from "../../../../lib/dashboard";
import { getSession } from "../../../../lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json(await getScopes(session));
  } catch {
    return NextResponse.json({ error: "Failed to load scopes" }, { status: 500 });
  }
}
