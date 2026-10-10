"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { LibraryUser } from "../lib/auth";

interface BorrowRequestPanelProps {
  bookId: number;
  availability: string;
  user: LibraryUser | null;
  borrowerLoan?: { id: number; status: string; ownerNote: string | null; expectedReturnAt: Date | null };
  ownerLoan?: { id: number; status: string; borrowerName: string; expectedReturnAt: Date | null };
  previewing?: boolean;
}

function availabilityLabel(status: string) {
  if (status === "on-loan") return "On loan";
  if (status === "reserved") return "Reserved";
  if (status === "lost") return "Unavailable";
  return "Available";
}

export default function BorrowRequestPanel({ bookId, availability, user, borrowerLoan, ownerLoan, previewing = false }: BorrowRequestPanelProps) {
  const router = useRouter();
  const [requestNote, setRequestNote] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function requestBook() {
    if (previewing) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/library/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, requestNote }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "The request could not be submitted.");
      setRequestNote("");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The request could not be submitted.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mt-12 border-t border-[var(--line)] pt-8" aria-labelledby="borrowing-title">
      <p className="eyebrow">Borrowing</p>
      <h2 id="borrowing-title" className="mt-3 text-2xl font-medium tracking-tight">{availabilityLabel(availability)}</h2>

      {!user && availability === "available" && (
        <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
          <Link className="underline underline-offset-4 hover:text-[var(--coral)]" href="/library/account">Sign in or create an account</Link> to request this book.
        </p>
      )}

      {user?.role === "borrower" && borrowerLoan && (
        <div className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
          <p>
            {borrowerLoan.status === "rejected" ? "Your previous request was declined." : borrowerLoan.status === "returned" ? "Your previous loan was returned." : <>Your request is <strong>{borrowerLoan.status.replace("-", " ")}</strong></>}
            {borrowerLoan.expectedReturnAt && ` · expected return ${borrowerLoan.expectedReturnAt.toLocaleDateString("en-US", { timeZone: "UTC" })}`}.
          </p>
          {borrowerLoan.ownerNote && <p className="mt-2 border-l-2 border-[var(--line)] pl-3">Owner note: {borrowerLoan.ownerNote}</p>}
        </div>
      )}

      {user?.role === "borrower" && (!borrowerLoan || borrowerLoan.status === "rejected" || borrowerLoan.status === "returned") && availability === "available" && (
        <div className="mt-4 grid gap-3">
          <label className="grid gap-2 text-xs font-medium" htmlFor="loan-request-note">
            Note for the owner (optional)
            <textarea id="loan-request-note" rows={3} maxLength={500} value={requestNote} onChange={(event) => setRequestNote(event.target.value)} className="border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-sm outline-none focus:border-[var(--coral)]" />
          </label>
          {previewing && <p className="text-xs text-[var(--muted)]">Preview only — requests are disabled.</p>}
          <button type="button" onClick={requestBook} disabled={pending || previewing} className="h-11 w-fit border border-[var(--ink)] bg-[var(--ink)] px-5 text-sm font-medium text-[var(--paper)] hover:bg-[var(--coral)] disabled:opacity-50">
            {pending ? "Sending request…" : "Request to borrow"}
          </button>
        </div>
      )}

      {user?.role === "owner" && (
        <div className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
          {ownerLoan ? <p>Current borrower: {ownerLoan.borrowerName} · {ownerLoan.status.replace("-", " ")}</p> : <p>Manage requests for this book in the owner loan queue.</p>}
          <Link href="/library/loans" className="mt-2 inline-block text-link">Open loan queue <span aria-hidden="true">→</span></Link>
        </div>
      )}

      {error && <p role="alert" className="mt-4 text-sm text-[var(--coral)]">{error}</p>}
    </section>
  );
}
