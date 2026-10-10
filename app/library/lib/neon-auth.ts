import { createNeonAuth } from "@neondatabase/auth/next/server";

export function getNeonAuth() {
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;

  if (!baseUrl || !cookieSecret) {
    throw new Error("Configure NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET to enable library accounts.");
  }

  return createNeonAuth({
    baseUrl,
    cookies: { secret: cookieSecret },
  });
}
