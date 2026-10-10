import "server-only";

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { Pool } from "pg";

export const spotifyScopes = ["user-top-read"] as const;
export const spotifyStateCookie = "spotify_oauth_state";
export const publicCacheMaxAgeMs = 10 * 60 * 1000;
export const publicCacheMaxStaleMs = 7 * 24 * 60 * 60 * 1000;

export type SpotifyTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

export type SpotifyTopItem = {
  id: string;
  name: string;
  url: string;
  image: string | null;
  subtitle: string;
};

export type SpotifyDashboardData = {
  range: string;
  updatedAt: string;
  tracks: SpotifyTopItem[];
  artists: SpotifyTopItem[];
};

type OwnerTokens = SpotifyTokens;
type DatabaseGlobal = typeof globalThis & { spotifyDatabasePool?: Pool };

const databaseGlobal = globalThis as DatabaseGlobal;

export function spotifyConfig() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI, SPOTIFY_TOKEN_ENCRYPTION_KEY, SPOTIFY_OWNER_KEY, DATABASE_URL } = process.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI || !SPOTIFY_TOKEN_ENCRYPTION_KEY || !SPOTIFY_OWNER_KEY || !DATABASE_URL) return null;
  return { clientId: SPOTIFY_CLIENT_ID, clientSecret: SPOTIFY_CLIENT_SECRET, redirectUri: SPOTIFY_REDIRECT_URI, tokenEncryptionKey: SPOTIFY_TOKEN_ENCRYPTION_KEY, ownerKey: SPOTIFY_OWNER_KEY };
}

export function getSpotifyDatabase() {
  if (!process.env.DATABASE_URL) throw new Error("Spotify database is not configured");
  if (!databaseGlobal.spotifyDatabasePool) {
    databaseGlobal.spotifyDatabasePool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3, idleTimeoutMillis: 10_000 });
  }
  return databaseGlobal.spotifyDatabasePool;
}

function encryptionKey(secret: string) {
  return scryptSync(secret, "portfolio-spotify-session-v1", 32);
}

export function sealTokens(tokens: SpotifyTokens, secret: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(secret), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(tokens)), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map((part) => part.toString("base64url")).join(".");
}

export function unsealTokens(value: string, secret: string): SpotifyTokens | null {
  try {
    const [ivText, tagText, encryptedText] = value.split(".");
    if (!ivText || !tagText || !encryptedText) return null;
    const decipher = createDecipheriv("aes-256-gcm", encryptionKey(secret), Buffer.from(ivText, "base64url"));
    decipher.setAuthTag(Buffer.from(tagText, "base64url"));
    const result = Buffer.concat([decipher.update(Buffer.from(encryptedText, "base64url")), decipher.final()]).toString("utf8");
    const parsed = JSON.parse(result) as Partial<SpotifyTokens>;
    if (typeof parsed.accessToken !== "string" || typeof parsed.refreshToken !== "string" || typeof parsed.expiresAt !== "number") return null;
    return parsed as SpotifyTokens;
  } catch {
    return null;
  }
}

export async function saveOwnerTokens(tokens: OwnerTokens, secret: string) {
  const encryptedTokens = sealTokens(tokens, secret);
  await getSpotifyDatabase().query(
    `INSERT INTO public.spotify_owner_tokens (id, encrypted_tokens, expires_at, public_consent_at, updated_at)
     VALUES (1, $1, to_timestamp($2 / 1000.0), now(), now())
     ON CONFLICT (id) DO UPDATE SET encrypted_tokens = EXCLUDED.encrypted_tokens, expires_at = EXCLUDED.expires_at, public_consent_at = now(), updated_at = now()`,
    [encryptedTokens, tokens.expiresAt],
  );
}

export async function readOwnerTokens(secret: string) {
  const result = await getSpotifyDatabase().query<{ encrypted_tokens: string }>(
    "SELECT encrypted_tokens FROM public.spotify_owner_tokens WHERE id = 1 LIMIT 1",
  );
  const encrypted = result.rows[0]?.encrypted_tokens;
  return encrypted ? unsealTokens(encrypted, secret) : null;
}

export async function deleteOwnerTokens() {
  await getSpotifyDatabase().query("DELETE FROM public.spotify_owner_tokens WHERE id = 1");
}

export async function readPublicDashboard(range: string) {
  const result = await getSpotifyDatabase().query<{ payload: SpotifyDashboardData; updated_at: Date }>(
    "SELECT payload, updated_at FROM public.spotify_dashboard_cache WHERE time_range = $1 LIMIT 1",
    [range],
  );
  const row = result.rows[0];
  return row ? { ...row.payload, range, updatedAt: row.updated_at.toISOString() } : null;
}

export async function savePublicDashboard(data: SpotifyDashboardData) {
  await getSpotifyDatabase().query(
    `INSERT INTO public.spotify_dashboard_cache (time_range, payload, updated_at)
     VALUES ($1, $2::jsonb, now())
     ON CONFLICT (time_range) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()`,
    [data.range, JSON.stringify({ tracks: data.tracks, artists: data.artists })],
  );
}

export async function clearPublicDashboard() {
  await getSpotifyDatabase().query("DELETE FROM public.spotify_dashboard_cache");
}

export async function deletePublicDashboard(range: string) {
  await getSpotifyDatabase().query("DELETE FROM public.spotify_dashboard_cache WHERE time_range = $1", [range]);
}

type SpotifyArtistRecord = { name?: string };
type SpotifyTrackRecord = {
  id?: string;
  name?: string;
  external_urls?: { spotify?: string };
  album?: { images?: { url: string }[] };
  artists?: SpotifyArtistRecord[];
};
type SpotifyArtistProfile = {
  id?: string;
  name?: string;
  external_urls?: { spotify?: string };
  images?: { url: string }[];
  genres?: string[];
};

export function normalizeTrack(track: SpotifyTrackRecord): SpotifyTopItem {
  return {
    id: track.id ?? "",
    name: track.name ?? "Untitled track",
    url: track.external_urls?.spotify ?? "https://open.spotify.com",
    image: track.album?.images?.[0]?.url ?? null,
    subtitle: (track.artists ?? []).map((artist) => artist.name).filter(Boolean).join(", "),
  };
}

export function normalizeArtist(artist: SpotifyArtistProfile): SpotifyTopItem {
  return {
    id: artist.id ?? "",
    name: artist.name ?? "Unknown artist",
    url: artist.external_urls?.spotify ?? "https://open.spotify.com",
    image: artist.images?.[0]?.url ?? null,
    subtitle: (artist.genres ?? []).slice(0, 2).join(" · ") || "Artist",
  };
}

export function newOAuthState() {
  return randomBytes(24).toString("base64url");
}
