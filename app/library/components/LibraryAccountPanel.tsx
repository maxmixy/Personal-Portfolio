"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LibraryUser } from "../lib/auth";
import { neonAuthClient } from "../lib/neon-auth-client";

interface LibraryAccountPanelProps {
  user: LibraryUser | null;
  preview?: boolean;
  previewRole?: "public" | "borrower" | "owner";
}

type AccountMode = "sign-in" | "create" | "verify";

export default function LibraryAccountPanel({ user, preview = false, previewRole = "public" }: LibraryAccountPanelProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AccountMode>("sign-in");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setNotice("");
    try {
      if (mode === "verify") {
        const result = await neonAuthClient.emailOtp.verifyEmail({ email, otp: verificationCode.trim() });
        if (result.error) throw new Error(result.error.message || "The verification code could not be confirmed.");
        setVerificationCode("");
        setPassword("");
        setMode("sign-in");
        setNotice("Email verified. Sign in to finish setting up your library account.");
        return;
      }

      const result = mode === "create"
        ? await neonAuthClient.signUp.email({ email, name: displayName, password })
        : await neonAuthClient.signIn.email({ email, password });
      if (result.error) throw new Error(result.error.message || "The account request failed.");

      setPassword("");
      if (mode === "create") {
        setMode("verify");
        setNotice("Account created. Enter the verification code sent to your email.");
      } else {
        router.refresh();
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "The account request failed.");
    } finally {
      setPending(false);
    }
  }

  async function resendVerificationCode() {
    setPending(true);
    setError("");
    setNotice("");
    try {
      const result = await neonAuthClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
      if (result.error) throw new Error(result.error.message || "A verification code could not be sent.");
      setNotice("A new verification code has been sent.");
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : "A verification code could not be sent.");
    } finally {
      setPending(false);
    }
  }

  async function signOut() {
    setPending(true);
    setError("");
    setNotice("");
    try {
      const result = await neonAuthClient.signOut();
      if (result.error) throw new Error(result.error.message || "Sign-out could not be completed.");
      router.refresh();
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : "Sign-out could not be completed.");
    } finally {
      setPending(false);
    }
  }

  if (preview) {
    return (
      <div className="border border-[var(--line)] bg-[var(--paper)] p-5 md:p-7">
        <p className="eyebrow">Role preview / {previewRole}</p>
        <h2 className="mt-3 text-2xl font-medium tracking-tight">
          {previewRole === "public" ? "Signed-out visitor" : previewRole === "borrower" ? "Borrower account" : "Owner account"}
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
          {previewRole === "public"
            ? "A public visitor can create an account or sign in to request books."
            : previewRole === "borrower"
              ? "A borrower can view their library account and private loan activity."
              : "The owner can manage the library account and borrowing activity."}
          {" "}Authentication controls are disabled while previewing.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" disabled className="h-10 border border-[var(--line)] px-4 text-sm opacity-50">Sign in</button>
          <button type="button" disabled className="h-10 border border-[var(--line)] px-4 text-sm opacity-50">Create account</button>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="border border-[var(--line)] bg-[var(--paper)] p-5">
        <p className="eyebrow">Signed in / {user.role}</p>
        <p className="mt-3 font-medium">{user.displayName}</p>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">{user.email}</p>
        {error && <p role="alert" className="mt-4 text-sm text-[var(--coral)]">{error}</p>}
        <button type="button" onClick={signOut} disabled={pending} className="mt-5 text-link disabled:opacity-50">
          {pending ? "Signing outâ€¦" : "Sign out"}
        </button>
      </div>
    );
  }

  return (
    <div className="border border-[var(--line)] bg-[var(--paper)] p-5 md:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="eyebrow">Library account</p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight">
            {mode === "create" ? "Create an account" : mode === "verify" ? "Verify your email" : "Sign in to your account"}
          </h2>
        </div>
        {mode !== "verify" && (
          <button
            type="button"
            onClick={() => {
              setMode(mode === "create" ? "sign-in" : "create");
              setError("");
              setNotice("");
            }}
            className="text-link"
          >
            {mode === "create" ? "I already have an account" : "Create an account"}
          </button>
        )}
      </div>

      <form onSubmit={submit} className="mt-7 grid gap-4 sm:grid-cols-2">
        {mode === "create" && (
          <label className="grid gap-2 text-xs font-medium sm:col-span-2">
            Name
            <input required minLength={2} maxLength={64} autoComplete="name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="h-11 border border-[var(--line)] bg-white px-3 text-sm outline-none focus:border-[var(--coral)]" />
          </label>
        )}
        <label className="grid gap-2 text-xs font-medium">
          Email
          <input required type="email" maxLength={254} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 border border-[var(--line)] bg-white px-3 text-sm outline-none focus:border-[var(--coral)]" />
        </label>
        {mode === "verify" ? (
          <label className="grid gap-2 text-xs font-medium">
            Verification code
            <input required type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={12} value={verificationCode} onChange={(event) => setVerificationCode(event.target.value)} className="h-11 border border-[var(--line)] bg-white px-3 text-sm tracking-[0.2em] outline-none focus:border-[var(--coral)]" />
          </label>
        ) : (
          <label className="grid gap-2 text-xs font-medium">
            Password
            <input required type="password" minLength={10} maxLength={128} autoComplete={mode === "create" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 border border-[var(--line)] bg-white px-3 text-sm outline-none focus:border-[var(--coral)]" />
            {mode === "create" && <span className="font-normal text-[var(--muted)]">Use 10 to 128 characters.</span>}
          </label>
        )}
        {notice && <p role="status" className="text-sm text-[var(--ink-soft)] sm:col-span-2">{notice}</p>}
        {error && <p role="alert" className="text-sm text-[var(--coral)] sm:col-span-2">{error}</p>}
        <button type="submit" disabled={pending} className="h-11 w-fit border border-[var(--ink)] bg-[var(--ink)] px-5 text-sm font-medium text-[var(--paper)] transition-colors hover:bg-[var(--coral)] disabled:opacity-50">
          {pending ? "Please waitâ€¦" : mode === "create" ? "Create account" : mode === "verify" ? "Verify email" : "Sign in"}
        </button>
        {mode === "verify" && (
          <button type="button" onClick={resendVerificationCode} disabled={pending} className="h-11 w-fit text-link disabled:opacity-50">
            Resend code
          </button>
        )}
      </form>
      {mode === "sign-in" && (
        <button type="button" onClick={() => { setMode("verify"); setError(""); setNotice(""); }} className="mt-4 text-link">
          Enter a verification code
        </button>
      )}
      {mode === "verify" && (
        <button type="button" onClick={() => { setMode("sign-in"); setError(""); setNotice(""); }} className="mt-4 text-link">
          Return to sign in
        </button>
      )}
    </div>
  );
}
