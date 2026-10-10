"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LibraryViewRole } from "../lib/role-preview";

const ROLES: { value: LibraryViewRole; label: string; description: string }[] = [
  { value: "public", label: "Public", description: "Signed-out visitor" },
  { value: "borrower", label: "Borrower", description: "Signed-in reader" },
  { value: "owner", label: "Owner", description: "Library management" },
];

export default function LibraryRolePreviewTab({
  isOwner,
  initialRole,
}: {
  isOwner: boolean;
  initialRole: LibraryViewRole;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  if (!isOwner) return null;

  async function selectRole(role: LibraryViewRole) {
    setPending(true);
    setError("");
    try {
      const response = await fetch("/library/api/role-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "The preview role could not be changed.");
      setSelectedRole(role);
      router.refresh();
    } catch (selectionError) {
      setError(selectionError instanceof Error ? selectionError.message : "The preview role could not be changed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <aside className="fixed right-0 top-1/2 z-50 -translate-y-1/2" aria-label="Owner role preview">
      {open ? (
        <div className="mr-2 w-64 border border-[var(--line)] bg-[var(--paper)] p-4 shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Owner preview</p>
              <p className="mt-2 text-xs leading-5 text-[var(--ink-soft)]">Preview role-specific library pages. Actions are disabled outside owner view.</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close role preview" className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">×</button>
          </div>
          <div className="mt-4 grid gap-2">
            {ROLES.map((role) => (
              <button
                key={role.value}
                type="button"
                disabled={pending}
                aria-pressed={selectedRole === role.value}
                onClick={() => selectRole(role.value)}
                className={`border px-3 py-2 text-left transition-colors disabled:opacity-50 ${selectedRole === role.value ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-[var(--line)] hover:border-[var(--coral)]"}`}
              >
                <span className="block text-sm font-medium">{role.label}</span>
                <span className={`mt-0.5 block text-xs ${selectedRole === role.value ? "text-[var(--paper)]/75" : "text-[var(--ink-soft)]"}`}>{role.description}</span>
              </button>
            ))}
          </div>
          {error && <p role="alert" className="mt-3 text-xs text-[var(--coral)]">{error}</p>}
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="border border-r-0 border-[var(--ink)] bg-[var(--ink)] px-3 py-4 text-xs font-medium tracking-wide text-[var(--paper)] shadow-lg hover:bg-[var(--coral)]"
        style={{ writingMode: "vertical-rl" }}
      >
        Preview / {selectedRole}
      </button>
    </aside>
  );
}
