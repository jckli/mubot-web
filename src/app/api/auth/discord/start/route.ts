import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { oauthStateCookieName } from "../../../../../lib/session";

export async function GET(req: NextRequest) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Missing DISCORD_CLIENT_ID" }, { status: 500 });
  }
  const state = crypto.randomBytes(16).toString("base64url");
  const redirectUri =
    process.env.DISCORD_REDIRECT_URI ||
    `${req.nextUrl.protocol}//${req.nextUrl.host}/api/auth/discord/callback`;

  const url = new URL("https://discord.com/oauth2/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "identify guilds");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "none");

  const res = NextResponse.redirect(url);
  res.cookies.set(oauthStateCookieName, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
