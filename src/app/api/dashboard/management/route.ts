import { NextRequest, NextResponse } from "next/server";
import { applyManagementAction, getManagementState } from "../../../../lib/dashboard-access";
import { ManagementAction } from "../../../../lib/dashboard-types";
import { getSession, refreshSession, setSessionCookie } from "../../../../lib/session";

const sessionForRequest = async () => {
  const current = await getSession();
  return current && refreshSession(current);
};

const response = (body: unknown, session: Awaited<ReturnType<typeof sessionForRequest>>) => {
  const res = NextResponse.json(body);
  if (session?.refreshed) setSessionCookie(res, session.session);
  return res;
};

const isAction = (value: unknown): value is ManagementAction => {
  if (!value || typeof value !== "object" || !("type" in value)) return false;
  const action = value as Record<string, unknown>;
  if (["add", "remove", "clearGroup"].includes(String(action.type))) return Number.isSafeInteger(action.mangaId);
  if (action.type === "setGroup") return Number.isSafeInteger(action.mangaId) && Number.isSafeInteger(action.groupId) && typeof action.groupName === "string";
  if (action.type === "clearRole") return action.roleType === "ping" || action.roleType === "admin";
  if (action.type === "setRole") return (action.roleType === "ping" || action.roleType === "admin") && typeof action.roleId === "string" && /^\d+$/.test(action.roleId);
  return false;
};

export async function GET(req: NextRequest) {
  const session = await sessionForRequest();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return response(await getManagementState(session.session, req.nextUrl.searchParams.get("scope") || ""), session);
  } catch {
    return NextResponse.json({ error: "Failed to load permissions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await sessionForRequest();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const scope = req.nextUrl.searchParams.get("scope") || "";
  const action = await req.json().catch(() => null);
  if (!isAction(action)) return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  try {
    const access = await getManagementState(session.session, scope);
    const roleAction = action.type === "setRole" || action.type === "clearRole";
    if (!access.canEdit || (roleAction && !scope.startsWith("server:")) || (roleAction && action.roleType === "admin" && !access.canManageAdmin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await applyManagementAction(scope, action);
    return response({ ok: true }, session);
  } catch {
    return NextResponse.json({ error: "Unable to update this list" }, { status: 500 });
  }
}
