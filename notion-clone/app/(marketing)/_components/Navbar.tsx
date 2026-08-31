"use client";

import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";

import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useScrollTop } from "@/hooks/use-scroll-top";

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full bg-shell/85 backdrop-blur-sm transition-shadow",
        scrolled && "border-b shadow-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-x-4 px-6">
        <Link href="/" aria-label="Strata home">
          <Logo />
        </Link>

        <div className="ml-auto flex items-center gap-x-2">
          {(isLoading || !isAuthenticated) && (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button size="sm">Get Strata free</Button>
              </SignInButton>
            </>
          )}

          {isAuthenticated && !isLoading && (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/documents">Enter Strata</Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </>
          )}

          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
