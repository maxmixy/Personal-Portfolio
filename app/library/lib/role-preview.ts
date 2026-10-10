import { cookies } from "next/headers";
import type { LibraryUser } from "./auth";

export type LibraryViewRole = "public" | "borrower" | "owner";

const ROLE_PREVIEW_COOKIE = "library_view_as";

export async function getLibraryViewRole(user: LibraryUser | null): Promise<LibraryViewRole> {
  if (!user) return "public";
  if (user.role !== "owner") return "borrower";

  const requestedRole = (await cookies()).get(ROLE_PREVIEW_COOKIE)?.value;
  if (requestedRole === "public" || requestedRole === "borrower" || requestedRole === "owner") {
    return requestedRole;
  }
  return "owner";
}

export function getLibraryPreviewUser(user: LibraryUser | null, viewRole: LibraryViewRole): LibraryUser | null {
  if (!user || viewRole === "public") return null;
  if (viewRole === "owner") return user;

  return {
    id: -1,
    email: "borrower-preview@example.invalid",
    displayName: "Preview borrower",
    role: "borrower",
  };
}

export function isRolePreview(user: LibraryUser | null, viewRole: LibraryViewRole) {
  return user?.role === "owner" && viewRole !== "owner";
}

export { ROLE_PREVIEW_COOKIE };
