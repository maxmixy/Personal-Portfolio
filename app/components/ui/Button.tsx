import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const buttonStyles =
  "inline-flex min-h-11 items-center justify-center border border-[var(--ink)] bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-[var(--paper)] transition-all hover:-translate-y-0.5 hover:border-[var(--coral)] hover:bg-[var(--coral)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--coral)]";

export default function Button({
  children,
  href,
  type = "button",
  onClick,
}: ButtonProps) {
  if (href) {
    return (
      <Link href={href} className={buttonStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonStyles}
    >
      {children}
    </button>
  );
}