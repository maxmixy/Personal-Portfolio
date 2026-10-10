import { NextRequest, NextResponse } from "next/server";
import { saveOwnerTokens, spotifyConfig, spotifyStateCookie, SpotifyTokens } from "../../spotify";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const url = new URL("/music", request.url);
  const config = spotifyConfig();
  const code = request.nextUrl.searchParams.get("code");
  const returnedState = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get(spotifyStateCookie)?.value;
  const oauthError = request.nextUrl.searchParams.get("error");

  if (!config) url.searchParams.set("setup", "required");
  else if (oauthError) url.searchParams.set("error", "authorization");
  else if (!code || !returnedState || !expectedState || returnedState !== expectedState) url.searchParams.set("error", "state");
  else {
    try {
      const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: config.redirectUri }),
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Spotify token exchange failed");
      const body = await response.json();
      const tokens: SpotifyTokens = { accessToken: body.access_token, refreshToken: body.refresh_token, expiresAt: Date.now() + body.expires_in * 1000 };
      await saveOwnerTokens(tokens, config.tokenEncryptionKey);
      url.searchParams.set("connected", "1");
      const result = NextResponse.redirect(url);
      result.cookies.delete(spotifyStateCookie);
      return result;
    } catch {
      url.searchParams.set("error", "token");
    }
  }

  const result = NextResponse.redirect(url);
  result.cookies.delete(spotifyStateCookie);
  return result;
}
