"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { listOwnerLoans } from "../lib/loans";
import { getCatalogBookSlug } from "../lib/catalog.slug";

type OwnerLoan = Awaited<ReturnType<typeof listOwnerLoans>>[number];

export default function LoanQueue({ loans }: { loans: OwnerLoan[] }) {
  const router = useRouter();
  const [expectedReturns, setExpectedReturns] = useState<Record<number, string>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function updateLoan(loan: OwnerLoan, action: "approve" | "reject" | "hand-over" | "return") {
    setPendingId(loan.id);
    setError("");
    try {
      const response = await fetch(`/library/api/loans/${loan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          expectedReturnAt: expectedReturns[loan.id] ? new Date(expectedReturns[loan.id]).toISOString() : null,
          ownerNote: notes[loan.id] ?? "",
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "The loan could not be updated.");
      router.refresh();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "The loan could not be updated.");
    } finally {
      setPendingId(null);
    }
  }

  if (loans.length === 0) {
    return <p className="border border-dashed border-[var(--line)] p-7 text-sm text-[var(--ink-soft)]">There are no open requests or loans.</p>;
  }

  return (
    <div className="grid gap-5">
      {error && <p role="alert" className="border border-[var(--coral)] p-4 text-sm">{error}</p>}
      {loans.map((loan) => (
        <article key={loan.id} className="border border-[var(--line)] bg-[var(--paper)] p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">{loan.status.replace("-", " ")} / {loan.requestedAt.toLocaleDateString("en-US", { timeZone: "UTC" })}</p>
              <h2 className="mt-3 text-2xl font-medium tracking-tight">{loan.title}</h2>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">{loan.borrowerName} · {loan.borrowerEmail}</p>
              {loan.requestNote && <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[var(--ink-soft)]">{loan.requestNote}</p>}
              {loan.expectedReturnAt && <p className="mt-3 text-xs text-[var(--muted)]">Expected return: {loan.expectedReturnAt.toLocaleDateString("en-US", { timeZone: "UTC" })}</p>}
            </div>
            <Link href={`/library/${getCatalogBookSlug({ id: loan.bookId, title: loan.title })}`} className="text-link">View book <span aria-hidden="true">→</span></Link>
          </div>

          {loan.status === "requested" && (
            <label className="mt-5 grid max-w-sm gap-2 text-xs font-medium">
              Expected return date (optional)
              <input type="date" value={expectedReturns[loan.id] ?? ""} onChange={(event) => setExpectedReturns((current) => ({ ...current, [loan.id]: event.target.value }))} className="h-10 border border-[var(--line)] bg-white px-3 text-sm" />
            </label>
          )}

          <label className="mt-5 grid max-w-xl gap-2 text-xs font-medium">
            Note for borrower (optional)
            <input maxLength={1000} value={notes[loan.id] ?? loan.ownerNote ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [loan.id]: event.target.value }))} className="h-10 border border-[var(--line)] bg-white px-3 text-sm" />
          </label>

          <div className="mt-5 flex flex-wrap gap-3">
            {loan.status === "requested" && <>
              <button type="button" disabled={pendingId === loan.id} onClick={() => updateLoan(loan, "approve")} className="h-10 border border-[var(--ink)] bg-[var(--ink)] px-4 text-sm text-[var(--paper)] disabled:opacity-50">Approve and reserve</button>
              <button type="button" disabled={pendingId === loan.id} onClick={() => updateLoan(loan, "reject")} className="h-10 border border-[var(--line)] px-4 text-sm disabled:opacity-50">Reject</button>
            </>}
            {loan.status === "reserved" && <button type="button" disabled={pendingId === loan.id} onClick={() => updateLoan(loan, "hand-over")} className="h-10 border border-[var(--ink)] bg-[var(--ink)] px-4 text-sm text-[var(--paper)] disabled:opacity-50">Mark as handed over</button>}
            {loan.status === "on-loan" && <button type="button" disabled={pendingId === loan.id} onClick={() => updateLoan(loan, "return")} className="h-10 border border-[var(--ink)] bg-[var(--ink)] px-4 text-sm text-[var(--paper)] disabled:opacity-50">Record return</button>}
          </div>
        </article>
      ))}
    </div>
  );
}
