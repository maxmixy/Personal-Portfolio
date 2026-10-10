import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentLibraryUser } from "../../lib/auth";
import { ROLE_PREVIEW_COOKIE, type LibraryViewRole } from "../../lib/role-preview";

const allowedRoles: LibraryViewRole[] = ["public", "borrower", "owner"];

export async function POST(request: Request) {
  let user;
  try {
    user = await getCurrentLibraryUser();
  } catch {
    return NextResponse.json({ error: "The owner session could not be confirmed." }, { status: 401 });
  }
  if (!user || user.role !== "owner") {
    return NextResponse.json({ error: "Only the library owner can change preview roles." }, { status: 403 });
  }

  let payload: { role?: unknown };
  try {
    payload = (await request.json()) as { role?: unknown };
  } catch {
    return NextResponse.json({ error: "Choose a valid preview role." }, { status: 400 });
  }
  if (typeof payload.role !== "string" || !allowedRoles.includes(payload.role as LibraryViewRole)) {
    return NextResponse.json({ error: "Choose a valid preview role." }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ROLE_PREVIEW_COOKIE, payload.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/library",
    maxAge: 60 * 60 * 24 * 30,
  });
  return NextResponse.json({ role: payload.role });
}
