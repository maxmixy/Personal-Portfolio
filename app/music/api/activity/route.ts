import { NextResponse } from "next/server";
import {
  activityCacheMaxAgeMs,
  activityCacheMaxStaleMs,
  normalizeActivityTrack,
  readOwnerTokens,
  readPublicActivity,
  saveOwnerTokens,
  savePublicActivity,
  spotifyConfig,
  SpotifyActivityData,
  SpotifyTokens,
} from "../../spotify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  if (typeof body.access_token !== "string" || typeof body.expires_in !== "number") return null;
  return {
    accessToken: body.access_token as string,
    refreshToken: (body.refresh_token as string | undefined) ?? tokens.refreshToken,
    expiresAt: Date.now() + Number(body.expires_in) * 1000,
    scopes: typeof body.scope === "string" ? body.scope.split(/\s+/).filter(Boolean) : tokens.scopes,
  } satisfies SpotifyTokens;
}

function responseJson(data: SpotifyActivityData) {
  const response = NextResponse.json(data);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

async function providerMessage(response: Response) {
  try {
    const payload = await response.clone().json();
    const value = typeof payload?.error === "string" ? payload.error : payload?.error?.message;
    return typeof value === "string" ? value.slice(0, 180) : `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

function grantedScopeStatus(tokens: SpotifyTokens) {
  const requiredScopes = ["user-read-recently-played", "user-read-currently-playing"];
  return Object.fromEntries(requiredScopes.map((scope) => [scope, tokens.scopes ? tokens.scopes.includes(scope) : null]));
}

function failedResponse(
  status: number,
  cached: SpotifyActivityData | null,
  retryAfter: string | null,
  deniedScopes: string[] = [],
  upstreamStatuses?: { recentlyPlayed: number; currentlyPlaying: number },
  providerMessages?: { recentlyPlayed: string; currentlyPlaying: string },
  scopeGrant?: Record<string, boolean | null>,
) {
  if (cached && Date.now() - Date.parse(cached.updatedAt) <= activityCacheMaxStaleMs) {
    return responseJson({
      ...cached,
      currentlyPlaying: null,
      stale: true,
      errors: {
        ...cached.errors,
        ...(deniedScopes.includes("user-read-currently-playing") ? { currentlyPlaying: "permission_denied" as const } : { currentlyPlaying: "unavailable" as const }),
        ...(deniedScopes.includes("user-read-recently-played") ? { recentlyPlayed: "permission_denied" as const } : {}),
      },
    });
  }
  const limited = status === 429;
  const unauthorized = status === 401;
  const forbidden = status === 403;
  const error = limited ? "rate_limited" : unauthorized ? "owner_authorization_expired" : forbidden ? "activity_permission_denied" : "spotify_unavailable";
  const response = NextResponse.json({
    error,
    ...(deniedScopes.length ? { deniedScopes } : {}),
    ...(upstreamStatuses ? { upstreamStatuses } : {}),
    ...(providerMessages ? { providerMessages } : {}),
    ...(scopeGrant ? { scopeGrant } : {}),
  }, { status: limited ? 429 : unauthorized ? 503 : forbidden ? 403 : 502 });
  if (retryAfter) response.headers.set("Retry-After", retryAfter);
  return response;
}

export async function GET() {
  const config = spotifyConfig();
  if (!config) return NextResponse.json({ error: "setup" }, { status: 503 });

  let cached: SpotifyActivityData | null;
  let tokens: SpotifyTokens | null;
  try {
    [cached, tokens] = await Promise.all([readPublicActivity(), readOwnerTokens(config.tokenEncryptionKey)]);
  } catch {
    return NextResponse.json({ error: "storage_unavailable" }, { status: 503 });
  }

  const cacheAge = cached ? Date.now() - Date.parse(cached.updatedAt) : Infinity;
  if (cached && cacheAge < activityCacheMaxAgeMs) return responseJson(cached);
  if (cached && cacheAge > activityCacheMaxStaleMs) cached = null;
  if (!tokens) return cached ? responseJson({ ...cached, currentlyPlaying: null, stale: true, errors: { ...cached.errors, currentlyPlaying: "unavailable" } }) : NextResponse.json({ error: "not_published" }, { status: 503 });

  if (tokens.expiresAt < Date.now() + 60_000) {
    tokens = await refreshTokens(tokens, config);
    if (!tokens) return failedResponse(401, cached, null);
    try {
      await saveOwnerTokens(tokens, config.tokenEncryptionKey);
    } catch {
      return cached ? responseJson({ ...cached, currentlyPlaying: null, stale: true, errors: { ...cached.errors, currentlyPlaying: "unavailable" } }) : NextResponse.json({ error: "storage_unavailable" }, { status: 503 });
    }
  }

  if (tokens.scopes) {
    const requiredScopes = ["user-read-recently-played", "user-read-currently-playing"];
    const deniedScopes = requiredScopes.filter((scope) => !tokens.scopes?.includes(scope));
    if (deniedScopes.length) {
      return NextResponse.json({ error: "activity_permission_denied", deniedScopes, scopeGrant: grantedScopeStatus(tokens) }, { status: 403 });
    }
  }

  const headers = { Authorization: `Bearer ${tokens.accessToken}` };
  const [recentResponse, currentResponse] = await Promise.all([
    fetch("https://api.spotify.com/v1/me/player/recently-played?limit=10", { headers, cache: "no-store" }),
    fetch("https://api.spotify.com/v1/me/player/currently-playing", { headers, cache: "no-store" }),
  ]);
  const recentOk = recentResponse.ok;
  const currentOk = currentResponse.ok || currentResponse.status === 204;
  if (!recentOk && !currentOk) {
    const limited = recentResponse.status === 429 || currentResponse.status === 429;
    const retryAfter = recentResponse.headers.get("retry-after") ?? currentResponse.headers.get("retry-after");
    const upstreamStatus = limited ? 429 : recentResponse.status === 403 || currentResponse.status === 403 ? 403 : recentResponse.status === 401 || currentResponse.status === 401 ? 401 : recentResponse.status;
    const deniedScopes = [
      ...(recentResponse.status === 403 ? ["user-read-recently-played"] : []),
      ...(currentResponse.status === 403 ? ["user-read-currently-playing"] : []),
    ];
    const providerMessages = {
      recentlyPlayed: await providerMessage(recentResponse),
      currentlyPlaying: await providerMessage(currentResponse),
    };
    return failedResponse(upstreamStatus, cached, retryAfter, deniedScopes, {
      recentlyPlayed: recentResponse.status,
      currentlyPlaying: currentResponse.status,
    }, providerMessages, grantedScopeStatus(tokens));
  }

  const [recentBody, currentBody] = await Promise.all([
    recentOk ? recentResponse.json() : Promise.resolve(null),
    currentResponse.status === 200 ? currentResponse.json() : Promise.resolve(null),
  ]);
  const recentItems = Array.isArray(recentBody?.items) ? recentBody.items : null;
  type RecentEntry = { track?: Parameters<typeof normalizeActivityTrack>[0] & { type?: string }; played_at?: string };
  const recentEntries = recentItems as RecentEntry[] | null;
  const trackEntries = recentEntries?.filter((entry): entry is RecentEntry & { track: Parameters<typeof normalizeActivityTrack>[0] } => Boolean(entry.track) && entry.track?.type !== "episode");
  const currentItem = currentBody?.item && currentBody.item.type !== "episode" ? currentBody.item : null;
  const activityErrors: SpotifyActivityData["errors"] = {};
  if (!recentOk) activityErrors.recentlyPlayed = recentResponse.status === 429 ? "rate_limited" : recentResponse.status === 403 ? "permission_denied" : "unavailable";
  if (!currentOk) activityErrors.currentlyPlaying = currentResponse.status === 429 ? "rate_limited" : currentResponse.status === 403 ? "permission_denied" : "unavailable";
  const data: SpotifyActivityData = {
    updatedAt: new Date().toISOString(),
    recentlyPlayed: trackEntries
      ? trackEntries.map((entry) => normalizeActivityTrack(entry.track, { playedAt: entry.played_at }))
      : cached?.recentlyPlayed ?? [],
    currentlyPlaying: currentOk && currentBody?.is_playing === true && currentItem
      ? normalizeActivityTrack(currentItem, { progressMs: typeof currentBody.progress_ms === "number" ? currentBody.progress_ms : null })
      : null,
    errors: Object.keys(activityErrors).length ? activityErrors : undefined,
  };

  try {
    await savePublicActivity(data);
  } catch {
    return cached ? responseJson({ ...cached, currentlyPlaying: null, stale: true, errors: { ...cached.errors, currentlyPlaying: "unavailable" } }) : NextResponse.json({ error: "storage_unavailable" }, { status: 503 });
  }
  return responseJson(data);
}
