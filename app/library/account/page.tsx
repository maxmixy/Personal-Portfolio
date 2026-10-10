import type { Metadata } from "next";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import LibraryAccountPanel from "../components/LibraryAccountPanel";
import { getCurrentLibraryUser } from "../lib/auth";
import { getLibraryPreviewUser, getLibraryViewRole, isRolePreview } from "../lib/role-preview";

export const metadata: Metadata = { title: "Library account | Yuri Morrison" };
export const dynamic = "force-dynamic";

export default async function LibraryAccountPage() {
  let actualUser = null;
  try {
    actualUser = await getCurrentLibraryUser();
  } catch {
    // Let the account form render during first-time schema setup and report on submit.
  }
  const previewRole = await getLibraryViewRole(actualUser);
  const previewing = isRolePreview(actualUser, previewRole);
  const user = getLibraryPreviewUser(actualUser, previewRole);

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-width py-16 md:py-24">
        <p className="eyebrow">Library / Account</p>
        <h1 className="mt-6 max-w-3xl text-5xl font-medium leading-[0.98] tracking-tight md:text-7xl">
          Borrowing starts with an account<span className="accent-period">.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
          Create an account to request books and keep track of your own requests and loans.
          Requests are private to you and the library owner.
        </p>
        <div className="mt-12 max-w-3xl">
          <LibraryAccountPanel user={user} preview={previewing} previewRole={previewRole} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
