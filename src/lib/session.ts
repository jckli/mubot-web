import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "mubot_session";
const OAUTH_STATE_COOKIE = "mubot_oauth_state";
const SCOPE_GRANT_COOKIE = "mubot_scope_grant";

export interface UserSession {
  userId: string;
  username: string;
  avatar: string | null;
  accessToken: string;
}

interface ScopeGrant {
  userId: string;
  scopes: string[];
  expiresAt: number;
}

const getSecret = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("Missing SESSION_SECRET");
  return secret;
};

const sign = (payload: string) =>
  crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");

export const encodeSession = (session: UserSession) => {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
};

const decodePayload = <T,>(value: string): T | null => {
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  if (
    expected.length !== sig.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  ) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
};

const decodeSession = (value: string) => decodePayload<UserSession>(value);

export const getSession = async () => {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  return value ? decodeSession(value) : null;
};

export const encodeScopeGrant = (userId: string, scopes: string[], maxAge = 120) => {
  const payload = Buffer.from(
    JSON.stringify({ userId, scopes, expiresAt: Date.now() + maxAge * 1000 } satisfies ScopeGrant),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
};

export const getScopeGrant = async (userId: string) => {
  const value = (await cookies()).get(SCOPE_GRANT_COOKIE)?.value;
  const grant = value ? decodePayload<ScopeGrant>(value) : null;
  return grant?.userId === userId && grant.expiresAt > Date.now() ? new Set(grant.scopes) : null;
};

export const sessionCookieName = SESSION_COOKIE;
export const oauthStateCookieName = OAUTH_STATE_COOKIE;
export const scopeGrantCookieName = SCOPE_GRANT_COOKIE;
