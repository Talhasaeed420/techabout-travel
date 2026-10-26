import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  look?: "solid" | "outline";
  href?: string; // give it a link and it becomes a link that looks like a button
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

// Every button and button-link on the site comes from here, so the style is written once.
export default function Button({ children, look = "solid", href, type = "button", onClick, disabled = false, className = "" }: ButtonProps) {
  const classes = `btn btn--${look} ${className}`;

  return href ? (
    <Link href={href} className={classes}>
      {children}
    </Link>
  ) : (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
