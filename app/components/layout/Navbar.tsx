import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10 lg:px-12">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight"
        >
          Yuri Morrison
        </Link>

        <div className="flex items-center gap-6 text-sm text-[var(--muted)]">
          <Link
            href="/projects"
            className="transition-colors hover:text-[var(--foreground)]"
          >
            Projects
          </Link>

          <Link
            href="/experience"
            className="transition-colors hover:text-[var(--foreground)]"
          >
            Experience
          </Link>

          <Link
            href="/about"
            className="transition-colors hover:text-[var(--foreground)]"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="transition-colors hover:text-[var(--foreground)]"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}