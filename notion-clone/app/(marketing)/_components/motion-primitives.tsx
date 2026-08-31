"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * useReducedMotion reads matchMedia, so it can disagree between the server
 * render and the first client render. Any branch that changes DOM STRUCTURE
 * has to wait for mount, otherwise React throws a hydration mismatch.
 * Style-only differences are fine; structural ones are not.
 */
export function useMountedReducedMotion() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [forced, setForced] = useState(false);

  useEffect(() => {
    setMounted(true);
    /* ?motion=on forces motion on even when the OS asks to reduce it, and
       ?motion=off forces it off. Only for capturing stills and demoing; the
       OS preference remains the default for everyone else. It also stamps
       the root element so the CSS reduced-motion block can opt out too. */
    const param = new URLSearchParams(window.location.search).get("motion");
    if (param === "on" || param === "off") {
      setForced(param === "off");
      document.documentElement.dataset.motion = param;
    }
  }, []);

  if (typeof window !== "undefined" && document.documentElement.dataset.motion) {
    return forced;
  }
  return mounted && !!reduce;
}

/* ---------------------------------------------------------------------------
   Scroll progress. A hairline of volt across the top of the viewport.
   Job: orientation. On a long page the reader should know how far in they are.
--------------------------------------------------------------------------- */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-vivid"
    />
  );
}

/* ---------------------------------------------------------------------------
   Aurora. Slow volt light drifting behind the hero, over a hairline grid.
   Job: give the dark ground depth so the page reads as a surface with light
   on it rather than a flat rectangle. Purely decorative, so it is aria-hidden
   and it stops entirely under reduced motion.
--------------------------------------------------------------------------- */

export function Aurora({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <div
        className="aurora-field absolute -left-[15%] top-[-30%] h-[70vw] w-[70vw] rounded-full opacity-[0.30] blur-[110px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(var(--vivid) / 0.9), transparent 62%)",
        }}
      />
      <div
        className="aurora-field-slow absolute -right-[20%] top-[8%] h-[58vw] w-[58vw] rounded-full opacity-[0.18] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(190 90% 55% / 0.75), transparent 64%)",
        }}
      />
      <div className="grid-field absolute inset-0 opacity-70" />
      {/* Fades the grid out toward the section edges. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, transparent, hsl(var(--background)) 78%)",
        }}
      />
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Kinetic heading. Words rise out of their own baseline on a stagger.
   Job: storytelling. The headline assembles itself, which is the first
   signal that this page is not static.
--------------------------------------------------------------------------- */

export function KineticHeading({
  text,
  className,
  delay = 0,
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "p";
}) {
  const reduce = useMountedReducedMotion();
  /* A newline in `text` forces a line break, so headlines never break at an
     arbitrary point the copy did not intend. */
  const lines = text.split("\n").map((line) => line.split(" "));
  const duration = reduce ? 0 : 0.85;
  const stagger = reduce ? 0 : 0.055;
  const MotionTag = motion[Tag];

  /* Structure is identical either way. Only the animation is dropped, so
     there is nothing for hydration to disagree about. */
  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate="shown"
      variants={{
        shown: {
          transition: {
            staggerChildren: stagger,
            delayChildren: reduce ? 0 : delay,
          },
        },
      }}
    >
      {lines.map((words, lineIndex) => (
        <span key={lineIndex} className="block">
          {words.map((word, i) => (
            <span
              key={word + i}
              /* pb-[0.14em] reserves descender room so g/y/p do not clip
                 against the mask. The word gap is a margin here rather than a
                 space inside the mask, which would be clipped away. */
              className={cn(
                "inline-block overflow-hidden pb-[0.14em] align-bottom",
                i < words.length - 1 && "mr-[0.26em]"
              )}
            >
              <motion.span
                data-entrance
                className="inline-block"
                variants={{
                  hidden: { y: "108%", opacity: 0 },
                  shown: { y: "0%", opacity: 1 },
                }}
                transition={{ duration, ease: EASE }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </MotionTag>
  );
}

/* ---------------------------------------------------------------------------
   Reveal. Scroll-triggered entrance with a clip so content wipes up rather
   than fading in. Job: hierarchy, one section at a time.
--------------------------------------------------------------------------- */

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useMountedReducedMotion();

  return (
    <motion.div
      data-entrance
      className={className}
      initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: reduce ? 0 : 0.7,
        delay: reduce ? 0 : delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------------------
   Magnetic. The element leans toward the pointer. Driven entirely by motion
   values so the React tree never re-renders on pointer move.
   Job: feedback. The primary CTA should feel like it wants to be pressed.
--------------------------------------------------------------------------- */

export function Magnetic({
  children,
  strength = 0.32,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useMountedReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 210, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 210, damping: 18, mass: 0.6 });

  const onMove = (event: React.PointerEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------------------
   Spotlight card. A volt highlight tracks the pointer across the surface.
   Job: feedback, and it gives the bento cells something to do on hover
   without moving any text.
--------------------------------------------------------------------------- */

export function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const reduce = useReducedMotion();

  const background = useMotionTemplate`radial-gradient(340px circle at ${mx}px ${my}px, hsl(var(--vivid) / 0.16), transparent 72%)`;

  const onMove = (event: React.PointerEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set(event.clientX - rect.left);
    my.set(event.clientY - rect.top);
  };

  const reset = () => {
    mx.set(-400);
    my.set(-400);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={cn(
        "group/spot relative overflow-hidden rounded-md border bg-card",
        className
      )}
    >
      {/* Always mounted. Under reduced motion the pointer values never move,
          so the highlight simply stays parked off the card. */}
      <motion.div
        aria-hidden
        style={{ background }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Parallax. Small counter-scroll on an asset so foreground and background
   separate. Job: depth. Kept subtle: a writing tool, not a parallax demo.
--------------------------------------------------------------------------- */

export function Parallax({
  children,
  distance = 60,
  className,
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useMountedReducedMotion();
  const travel = reduce ? 0 : distance;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [travel, -travel]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Horizontal pan. Vertical scroll drives a horizontal track while the section
   is pinned. Job: storytelling, one capability at a time, and it is the one
   moment on the page that takes over the scroll.
--------------------------------------------------------------------------- */

export function HorizontalPan({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useMountedReducedMotion();
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-62%"]);

  if (reduce) {
    return (
      <div className={cn("overflow-x-auto", className)}>
        <div className="flex gap-6 px-6 pb-4">{children}</div>
      </div>
    );
  }

  return (
    <div ref={wrap} className={cn("relative h-[280vh]", className)}>
      <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-6 pl-6 pr-[30vw]">
          {children}
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Marquee. One per page. Job: breadth without demanding attention per item.
--------------------------------------------------------------------------- */

export function Marquee({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div className="marquee-track flex shrink-0 items-center gap-14 pr-14">
        {children}
        {/* Duplicated for the seamless loop. Hidden from the a11y tree so the
            list is not announced twice. */}
        <span aria-hidden className="contents">
          {children}
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Grain. Fixed, pointer-events-none, never on a scrolling container.
--------------------------------------------------------------------------- */

export function Grain() {
  return <div aria-hidden className="grain-overlay" />;
}
