import { eq } from "drizzle-orm";
import { getDatabase } from "@/app/db";
import { libraryUsers } from "@/app/db/schema";
import { getNeonAuth } from "./neon-auth";

export interface LibraryUser {
  id: number;
  email: string;
  displayName: string;
  role: "borrower" | "owner";
}

export async function getCurrentLibraryUser(): Promise<LibraryUser | null> {
  const sessionResult = await getNeonAuth().getSession();
  const result = sessionResult as unknown as {
    data?: { user?: { id?: string; email?: string; name?: string | null; emailVerified?: boolean } | null } | null;
    user?: { id?: string; email?: string; name?: string | null; emailVerified?: boolean } | null;
  };
  const authUser = result.user ?? result.data?.user;
  if (!authUser?.id || !authUser.email || authUser.emailVerified !== true) return null;

  const email = authUser.email.trim().toLowerCase();
  const displayName = authUser.name?.trim() || email;
  const db = getDatabase();
  let [row] = await db.select().from(libraryUsers).where(eq(libraryUsers.authUserId, authUser.id)).limit(1);

  if (!row) {
    const [existingProfile] = await db.select().from(libraryUsers).where(eq(libraryUsers.email, email)).limit(1);
    if (existingProfile) {
      [row] = await db.update(libraryUsers)
        .set({ authUserId: authUser.id, email, displayName })
        .where(eq(libraryUsers.id, existingProfile.id))
        .returning();
    } else {
      [row] = await db.insert(libraryUsers)
        .values({ authUserId: authUser.id, email, displayName })
        .onConflictDoNothing()
        .returning();
    }
    if (!row) {
      [row] = await db.select().from(libraryUsers).where(eq(libraryUsers.authUserId, authUser.id)).limit(1);
    }
  }
  if (!row) throw new Error("The library profile could not be created for this account.");

  if (row.email !== email || row.displayName !== displayName) {
    [row] = await db.update(libraryUsers)
      .set({ email, displayName })
      .where(eq(libraryUsers.id, row.id))
      .returning();
  }
  return {
    id: row.id,
    email: row.email,
    displayName: row.displayName,
    role: row.role === "owner" ? "owner" : "borrower",
  };
}
