import Link from "next/link";

import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t bg-shell">
      <div className="mx-auto flex max-w-6xl flex-col gap-y-4 px-6 py-8 sm:flex-row sm:items-center">
        <Logo />
        <nav
          aria-label="Legal"
          className="flex items-center gap-x-6 text-sm text-muted-foreground sm:ml-auto"
        >
          <Link
            href="/privacy"
            className="rounded-sm transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="rounded-sm transition-colors hover:text-foreground"
          >
            Terms &amp; Conditions
          </Link>
        </nav>
      </div>
    </footer>
  );
}
