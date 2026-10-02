import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const buttonStyles =
  "inline-flex items-center justify-center border border-[var(--foreground)] bg-[var(--foreground)] px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-transparent hover:text-[var(--foreground)]";

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