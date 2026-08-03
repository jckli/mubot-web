import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "mubot_session";
const OAUTH_STATE_COOKIE = "mubot_oauth_state";
const SCOPE_GRANT_COOKIE = "mubot_scope_grant";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const REFRESH_MARGIN = 60_000;

export interface UserSession {
  userId: string;
  username: string;
  avatar: string | null;
  accessToken: string;
  refreshToken?: string;
  accessTokenExpiresAt?: number;
  sessionExpiresAt?: number;
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
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    crypto.createHash("sha256").update(getSecret()).digest(),
    iv,
  );
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(session), "utf8"), cipher.final()]);
  const payload = ["v1", iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), encrypted.toString("base64url")].join(".");
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

const decodeSession = (value: string) => {
  if (!value.startsWith("v1.")) return decodePayload<UserSession>(value);
  const parts = value.split(".");
  if (parts.length !== 5) return null;
  const [version, iv, tag, encrypted, sig] = parts;
  const payload = [version, iv, tag, encrypted].join(".");
  const expected = sign(payload);
  if (
    expected.length !== sig.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  ) {
    return null;
  }
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      crypto.createHash("sha256").update(getSecret()).digest(),
      Buffer.from(iv, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    return JSON.parse(
      Buffer.concat([decipher.update(Buffer.from(encrypted, "base64url")), decipher.final()]).toString("utf8"),
    ) as UserSession;
  } catch {
    return null;
  }
};

export const getSession = async () => {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = value ? decodeSession(value) : null;
  return session?.sessionExpiresAt && session.sessionExpiresAt <= Date.now() ? null : session;
};

export const refreshSession = async (session: UserSession) => {
  if (!session.refreshToken || !session.accessTokenExpiresAt || session.accessTokenExpiresAt > Date.now() + REFRESH_MARGIN) {
    return { session, refreshed: false };
  }
  if (session.sessionExpiresAt && session.sessionExpiresAt <= Date.now()) return null;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  const response = await fetch("https://discord.com/api/v10/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: session.refreshToken,
    }),
  });
  if (!response.ok) return null;
  const token = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };
  return {
    refreshed: true,
    session: {
      ...session,
      accessToken: token.access_token,
      refreshToken: token.refresh_token || session.refreshToken,
      accessTokenExpiresAt: Date.now() + token.expires_in * 1000,
    },
  };
};

export const setSessionCookie = (response: NextResponse, session: UserSession) => {
  const remaining = session.sessionExpiresAt
    ? Math.max(0, Math.floor((session.sessionExpiresAt - Date.now()) / 1000))
    : SESSION_MAX_AGE;
  response.cookies.set(SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.min(SESSION_MAX_AGE, remaining),
  });
};

export const newSession = (session: Omit<UserSession, "sessionExpiresAt">): UserSession => ({
  ...session,
  sessionExpiresAt: Date.now() + SESSION_MAX_AGE * 1000,
});

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
