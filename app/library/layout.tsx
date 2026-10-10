import { getCurrentLibraryUser } from "./lib/auth";
import { getLibraryViewRole } from "./lib/role-preview";
import LibraryRolePreviewTab from "./components/LibraryRolePreviewTab";

export const dynamic = "force-dynamic";

export default async function LibraryLayout({ children }: { children: React.ReactNode }) {
  let user = null;
  try {
    user = await getCurrentLibraryUser();
  } catch {
    // Keep public library pages available if auth setup is temporarily unavailable.
  }

  const viewRole = await getLibraryViewRole(user);

  return (
    <>
      {children}
      <LibraryRolePreviewTab key={viewRole} isOwner={user?.role === "owner"} initialRole={viewRole} />
    </>
  );
}
