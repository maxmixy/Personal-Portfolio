import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { newOAuthState, spotifyConfig, spotifyScopes, spotifyStateCookie } from "../../spotify";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const config = spotifyConfig();
  if (!config) return NextResponse.redirect(new URL("/music?setup=required", request.url), 303);
  const form = await request.formData();
  const providedKey = form.get("ownerKey");
  if (typeof providedKey !== "string" || form.get("publishConsent") !== "on") return NextResponse.redirect(new URL("/music?ownerError=1", request.url), 303);
  const providedBuffer = Buffer.from(providedKey);
  const expectedBuffer = Buffer.from(config.ownerKey);
  if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) {
    return NextResponse.redirect(new URL("/music?ownerError=1", request.url), 303);
  }

  const state = newOAuthState();
  const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
  authorizeUrl.search = new URLSearchParams({
    response_type: "code",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: spotifyScopes.join(" "),
    state,
  }).toString();

  const response = NextResponse.redirect(authorizeUrl, 303);
  response.cookies.set(spotifyStateCookie, state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 600 });
  return response;
}
