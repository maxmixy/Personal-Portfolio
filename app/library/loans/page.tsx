import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Container from "../../components/layout/Container";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import LoanQueue from "../components/LoanQueue";
import { getCurrentLibraryUser, type LibraryUser } from "../lib/auth";
import { listOwnerLoans } from "../lib/loans";
import { getLibraryViewRole } from "../lib/role-preview";

export const metadata: Metadata = { title: "Loan requests | Library" };
export const dynamic = "force-dynamic";

export default async function LibraryLoansPage() {
  let user: LibraryUser | null;
  try {
    user = await getCurrentLibraryUser();
  } catch {
    redirect("/library/account");
  }
  if (!user) redirect("/library/account");
  if (user.role !== "owner") redirect("/library");

  const viewRole = await getLibraryViewRole(user);
  if (viewRole !== "owner") {
    return (
      <div className="home-page">
        <Navbar />
        <main className="section-band py-14 md:py-20">
          <Container>
            <p className="eyebrow">Library / {viewRole} preview</p>
            <h1 className="mt-5 text-5xl font-medium tracking-tight md:text-7xl">Loan requests<span className="accent-period">.</span></h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
              {viewRole === "public" ? "Sign in to request a book. Loan requests and borrower details are private." : "Loan requests are available to the library owner only."}
            </p>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  let loans: Awaited<ReturnType<typeof listOwnerLoans>>;
  try {
    loans = await listOwnerLoans();
  } catch {
    loans = [];
  }

  return (
    <div className="home-page">
      <Navbar />
      <main className="section-band py-14 md:py-20">
        <Container>
          <p className="eyebrow">Library / Owner tools</p>
          <h1 className="mt-5 text-5xl font-medium tracking-tight md:text-7xl">Loan requests<span className="accent-period">.</span></h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
            Review requests, reserve approved books, record physical handovers, and mark returned books available again.
          </p>
          <div className="mt-10"><LoanQueue loans={loans} /></div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
