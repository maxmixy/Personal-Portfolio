import { NextRequest, NextResponse } from "next/server";
import {
  normalizeArtist,
  normalizeTrack,
  publicCacheMaxAgeMs,
  publicCacheMaxStaleMs,
  deletePublicDashboard,
  readOwnerTokens,
  readPublicDashboard,
  saveOwnerTokens,
  savePublicDashboard,
  spotifyConfig,
  SpotifyDashboardData,
  SpotifyTokens,
} from "../../spotify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ranges = new Set(["short_term", "medium_term", "long_term"]);

async function refreshTokens(tokens: SpotifyTokens, config: NonNullable<ReturnType<typeof spotifyConfig>>) {
  const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: tokens.refreshToken }),
    cache: "no-store",
  });
  if (!response.ok) return null;
  const body = await response.json();
  return {
    accessToken: body.access_token as string,
    refreshToken: (body.refresh_token as string | undefined) ?? tokens.refreshToken,
    expiresAt: Date.now() + Number(body.expires_in) * 1000,
  } satisfies SpotifyTokens;
}

function publicJson(data: SpotifyDashboardData, stale = false) {
  const response = NextResponse.json({ ...data, stale });
  response.headers.set("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=120");
  return response;
}

export async function GET(request: NextRequest) {
  const config = spotifyConfig();
  if (!config) return NextResponse.json({ error: "setup" }, { status: 503 });

  const range = request.nextUrl.searchParams.get("range") ?? "medium_term";
  if (!ranges.has(range)) return NextResponse.json({ error: "invalid_range" }, { status: 400 });

  let cached: SpotifyDashboardData | null;
  let tokens: SpotifyTokens | null;
  try {
    [cached, tokens] = await Promise.all([readPublicDashboard(range), readOwnerTokens(config.tokenEncryptionKey)]);
  } catch {
    return NextResponse.json({ error: "storage_unavailable" }, { status: 503 });
  }
  if (cached && Date.now() - Date.parse(cached.updatedAt) > publicCacheMaxStaleMs) {
    await deletePublicDashboard(range);
    cached = null;
  }
  if (cached && Date.now() - Date.parse(cached.updatedAt) < publicCacheMaxAgeMs) return publicJson(cached);
  if (!tokens) return cached ? publicJson(cached, true) : NextResponse.json({ error: "not_published" }, { status: 503 });

  if (tokens.expiresAt < Date.now() + 60_000) {
    tokens = await refreshTokens(tokens, config);
    if (!tokens) {
      return cached ? publicJson(cached, true) : NextResponse.json({ error: "owner_authorization_expired" }, { status: 503 });
    }
    try {
      await saveOwnerTokens(tokens, config.tokenEncryptionKey);
    } catch {
      return cached ? publicJson(cached, true) : NextResponse.json({ error: "storage_unavailable" }, { status: 503 });
    }
  }

  const query = `limit=10&time_range=${range}`;
  const headers = { Authorization: `Bearer ${tokens.accessToken}` };
  const [tracksResponse, artistsResponse] = await Promise.all([
    fetch(`https://api.spotify.com/v1/me/top/tracks?${query}`, { headers, cache: "no-store" }),
    fetch(`https://api.spotify.com/v1/me/top/artists?${query}`, { headers, cache: "no-store" }),
  ]);
  if (!tracksResponse.ok || !artistsResponse.ok) {
    const rateLimited = tracksResponse.status === 429 || artistsResponse.status === 429;
    if (cached) return publicJson(cached, true);
    const response = NextResponse.json({ error: rateLimited ? "rate_limited" : "spotify_unavailable" }, { status: rateLimited ? 429 : 502 });
    const retryAfter = tracksResponse.headers.get("retry-after") ?? artistsResponse.headers.get("retry-after");
    if (retryAfter) response.headers.set("Retry-After", retryAfter);
    return response;
  }

  const [tracks, artists] = await Promise.all([tracksResponse.json(), artistsResponse.json()]);
  const data: SpotifyDashboardData = {
    range,
    updatedAt: new Date().toISOString(),
    tracks: (tracks.items ?? []).map(normalizeTrack),
    artists: (artists.items ?? []).map(normalizeArtist),
  };
  try {
    await savePublicDashboard(data);
  } catch {
    return cached ? publicJson(cached, true) : NextResponse.json({ error: "storage_unavailable" }, { status: 503 });
  }
  return publicJson(data);
}
