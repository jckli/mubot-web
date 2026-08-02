import { NextRequest, NextResponse } from "next/server";
import {
  encodeSession,
  oauthStateCookieName,
  sessionCookieName,
} from "../../../../../lib/session";

interface DiscordToken {
  access_token: string;
}

interface DiscordMe {
  id: string;
  username: string;
  avatar: string | null;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const storedState = req.cookies.get(oauthStateCookieName)?.value;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri =
    process.env.DISCORD_REDIRECT_URI ||
    `${req.nextUrl.protocol}//${req.nextUrl.host}/api/auth/discord/callback`;

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Missing Discord OAuth env vars" },
      { status: 500 },
    );
  }

  const tokenRes = await fetch("https://discord.com/api/v10/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });
  if (!tokenRes.ok) return NextResponse.redirect(new URL("/", req.url));
  const token = (await tokenRes.json()) as DiscordToken;
  const meRes = await fetch("https://discord.com/api/v10/users/@me", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!meRes.ok) return NextResponse.redirect(new URL("/", req.url));
  const me = (await meRes.json()) as DiscordMe;

  const session = encodeSession({
    userId: me.id,
    username: me.username,
    avatar: me.avatar,
    accessToken: token.access_token,
  });

  const res = NextResponse.redirect(new URL("/dashboard", req.url));
  res.cookies.set(sessionCookieName, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  res.cookies.delete(oauthStateCookieName);
  return res;
}
