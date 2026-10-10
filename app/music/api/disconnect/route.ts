import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { clearPublicDashboard, deleteOwnerTokens, spotifyConfig } from "../../spotify";

export async function POST(request: Request) {
  const config = spotifyConfig();
  if (!config) return NextResponse.redirect(new URL("/music?setup=required", request.url), 303);
  const form = await request.formData();
  const providedKey = form.get("ownerKey");
  if (typeof providedKey !== "string") return NextResponse.redirect(new URL("/music?ownerError=1", request.url), 303);
  const providedBuffer = Buffer.from(providedKey);
  const expectedBuffer = Buffer.from(config.ownerKey);
  if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) {
    return NextResponse.redirect(new URL("/music?ownerError=1", request.url), 303);
  }
  try {
    await deleteOwnerTokens();
    await clearPublicDashboard();
  } catch {
    return NextResponse.redirect(new URL("/music?error=storage", request.url), 303);
  }
  return NextResponse.redirect(new URL("/music?disconnected=1", request.url), 303);
}
