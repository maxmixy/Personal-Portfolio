"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface PersonalMetadataEditorProps {
  bookId: number;
  rating: number | null;
  notes: string | null;
  review: string | null;
  readingStatus: string;
}

const STATUSES = [
  ["want-to-read", "Want to read"],
  ["reading", "Reading"],
  ["completed", "Completed"],
  ["abandoned", "Abandoned"],
  ["re-reading", "Re-reading"],
];

export default function PersonalMetadataEditor({ bookId, rating, notes, review, readingStatus }: PersonalMetadataEditorProps) {
  const router = useRouter();
  const [ratingValue, setRatingValue] = useState(rating?.toString() ?? "");
  const [notesValue, setNotesValue] = useState(notes ?? "");
  const [reviewValue, setReviewValue] = useState(review ?? "");
  const [statusValue, setStatusValue] = useState(readingStatus);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSaved(false);
    try {
      const response = await fetch(`/library/api/books/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: ratingValue ? Number(ratingValue) : null,
          notes: notesValue,
          review: reviewValue,
          readingStatus: statusValue,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Metadata could not be saved.");
      setSaved(true);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Metadata could not be saved.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={save} className="mt-7 grid gap-5 border border-[var(--line)] bg-[var(--paper)] p-5 md:grid-cols-2 md:p-7">
      <label className="grid gap-2 text-xs font-medium">
        Reading status
        <select value={statusValue} onChange={(event) => setStatusValue(event.target.value)} className="h-11 border border-[var(--line)] bg-white px-3 text-sm">
          {STATUSES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label className="grid gap-2 text-xs font-medium">
        Rating
        <select value={ratingValue} onChange={(event) => setRatingValue(event.target.value)} className="h-11 border border-[var(--line)] bg-white px-3 text-sm">
          <option value="">Not rated</option>
          {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} / 5</option>)}
        </select>
      </label>
      <label className="grid gap-2 text-xs font-medium md:col-span-2">
        Private notes
        <textarea rows={4} maxLength={5000} value={notesValue} onChange={(event) => setNotesValue(event.target.value)} className="border border-[var(--line)] bg-white px-3 py-2 text-sm leading-6" />
        <span className="font-normal text-[var(--muted)]">Visible only to the library owner.</span>
      </label>
      <label className="grid gap-2 text-xs font-medium md:col-span-2">
        Review
        <textarea rows={5} maxLength={10000} value={reviewValue} onChange={(event) => setReviewValue(event.target.value)} className="border border-[var(--line)] bg-white px-3 py-2 text-sm leading-6" />
      </label>
      {error && <p role="alert" className="text-sm text-[var(--coral)] md:col-span-2">{error}</p>}
      {saved && <p role="status" className="text-sm text-[var(--ink-soft)] md:col-span-2">Personal metadata saved.</p>}
      <button type="submit" disabled={pending} className="h-11 w-fit border border-[var(--ink)] bg-[var(--ink)] px-5 text-sm font-medium text-[var(--paper)] hover:bg-[var(--coral)] disabled:opacity-50">
        {pending ? "Saving…" : "Save personal metadata"}
      </button>
    </form>
  );
}
