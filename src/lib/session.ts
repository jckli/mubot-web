import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "mubot_session";
const OAUTH_STATE_COOKIE = "mubot_oauth_state";

export interface UserSession {
  userId: string;
  username: string;
  avatar: string | null;
  accessToken: string;
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

const decodeSession = (value: string): UserSession | null => {
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
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
};

export const getSession = async () => {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  return value ? decodeSession(value) : null;
};

export const sessionCookieName = SESSION_COOKIE;
export const oauthStateCookieName = OAUTH_STATE_COOKIE;
