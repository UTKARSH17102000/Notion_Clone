"use client";

import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { SignInButton } from "@clerk/clerk-react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Shot } from "./shot";
import {
  Aurora,
  KineticHeading,
  Magnetic,
  useMountedReducedMotion,
} from "./motion-primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const reduce = useMountedReducedMotion();

  // `initial` stays constant for the life of the element. Flipping it after
  // mount strands content in the hidden state, and differing between server
  // and client is a hydration mismatch. Reduced motion collapses the
  // duration instead of removing the animation.
  const fade = (delay: number) => ({
    "data-entrance": true,
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0 : 0.7,
      delay: reduce ? 0 : delay,
      ease: EASE,
    },
  });

  return (
    <section className="relative isolate overflow-hidden">
      <Aurora />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20">
        <div className="grid items-center gap-x-12 gap-y-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div>
            <motion.div {...fade(0)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-vivid/40 bg-vivid/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-vivid" />
                Write, nest, publish
              </span>
            </motion.div>

            <KineticHeading
              text={"Think it. Nest it.\nPublish it."}
              delay={0.12}
              className="mt-6 font-serif text-[clamp(2.6rem,6.2vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-balance"
            />

            <motion.p
              {...fade(0.42)}
              className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              A fast personal workspace for notes that grow. Nest pages as deep
              as you think, then turn any one of them into a public link.
            </motion.p>

            <motion.div
              {...fade(0.52)}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              {(isLoading || !isAuthenticated) && (
                <Magnetic>
                  <SignInButton mode="modal">
                    <Button size="lg" className="volt-glow">
                      Get Strata free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </SignInButton>
                </Magnetic>
              )}

              {!isLoading && isAuthenticated && (
                <Magnetic>
                  <Button size="lg" asChild className="volt-glow">
                    <Link href="/documents">
                      Enter Strata
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </Magnetic>
              )}

              <Button size="lg" variant="outline" asChild>
                <Link href="#editor">See the editor</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            data-entrance
            initial={{ opacity: 0, y: 34, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: reduce ? 0 : 1,
              delay: reduce ? 0 : 0.3,
              ease: EASE,
            }}
            className="relative lg:-mr-16 xl:-mr-28"
          >
            {/* Volt bloom sitting behind the product shot. */}
            <div
              aria-hidden
              className="absolute -inset-10 -z-10 opacity-60 blur-3xl"
              style={{
                background:
                  "radial-gradient(60% 55% at 55% 45%, hsl(var(--vivid) / 0.30), transparent 70%)",
              }}
            />
            <Shot
              name="workspace"
              alt="The Strata workspace: a nested page tree beside an open document with a cover image."
              width={1600}
              height={1000}
              priority
              sizes="(max-width: 1024px) 100vw, 62vw"
              className="shadow-[0_30px_90px_-30px_hsl(225_60%_2%/0.7)]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
