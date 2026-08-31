"use client";

import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { SignInButton } from "@clerk/clerk-react";
import { ArrowRight, CornerDownRight, Globe, Undo } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Shot } from "./shot";
import {
  HorizontalPan,
  KineticHeading,
  Magnetic,
  Marquee,
  Parallax,
  Reveal,
  SpotlightCard,
} from "./motion-primitives";

/* -------------------------------------------------------------------------
   The editor. Full-bleed media with a counter-scrolling frame.
------------------------------------------------------------------------- */

export function EditorSection() {
  return (
    <section
      id="editor"
      className="relative border-t bg-shell py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <KineticHeading
            as="h2"
            text="A canvas that gets out of the way"
            className="font-serif text-3xl font-semibold tracking-[-0.025em] sm:text-5xl"
          />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Body text is set in a serif at a measured column, so long documents
            stay readable. Press slash for headings, lists, quotes, checklists
            and images. Every change saves itself.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <Parallax distance={34}>
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-8 -z-10 opacity-50 blur-3xl"
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, hsl(var(--vivid) / 0.22), transparent 70%)",
                }}
              />
              <Shot
                name="editor"
                alt="The Strata editor with the slash command menu open, showing heading, quote, list and code block options."
                width={1600}
                height={1000}
                sizes="(max-width: 1024px) 100vw, 1100px"
              />
            </div>
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   Capabilities. Pinned horizontal pan: vertical scroll drives the track.
------------------------------------------------------------------------- */

const panels = [
  {
    kicker: "01",
    title: "Pages inside pages",
    body: "Every page can hold more pages. The tree expands and collapses, and the page you are reading is always marked.",
    tree: true,
  },
  {
    kicker: "02",
    title: "Two keystrokes to anywhere",
    body: "The command palette lists recents first, then everything else. It opens on Ctrl K and closes on Escape.",
    shot: "palette" as const,
  },
  {
    kicker: "03",
    title: "Deleting is reversible",
    body: "Pages go to the Trash with their date and a preview line, so you can tell them apart. Removing one for good takes a second step.",
    icon: Undo,
  },
  {
    kicker: "04",
    title: "Legible in both themes",
    body: "Light, dark, or whatever your machine is doing right now. The canvas holds its measure and its contrast either way.",
    invert: true,
  },
];

export function CapabilitiesSection() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-6 pt-24 sm:pt-32">
        <Reveal className="max-w-2xl">
          <KineticHeading
            as="h2"
            text="Built for notes that keep growing"
            className="font-serif text-3xl font-semibold tracking-[-0.025em] sm:text-5xl"
          />
        </Reveal>
      </div>

      <HorizontalPan className="mt-4">
        {panels.map((panel) => (
          <SpotlightCard
            key={panel.kicker}
            className="flex h-[62vh] w-[78vw] shrink-0 flex-col p-8 sm:w-[46vw] lg:w-[34vw]"
          >
            <span className="font-mono text-xs text-primary">
              {panel.kicker}
            </span>

            <h3 className="mt-5 max-w-[16ch] font-serif text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              {panel.title}
            </h3>
            <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
              {panel.body}
            </p>

            <div className="mt-auto pt-8">
              {panel.tree && (
                <ul className="space-y-1.5 font-mono text-sm text-muted-foreground">
                  <li className="text-foreground">Research</li>
                  <li className="flex items-center gap-x-2 pl-4">
                    <CornerDownRight className="h-3.5 w-3.5" aria-hidden />
                    Interview notes
                  </li>
                  <li className="flex items-center gap-x-2 pl-10">
                    <CornerDownRight className="h-3.5 w-3.5" aria-hidden />
                    Week one
                  </li>
                  <li className="flex items-center gap-x-2 pl-16 text-primary">
                    <CornerDownRight className="h-3.5 w-3.5" aria-hidden />
                    Week two
                  </li>
                </ul>
              )}

              {panel.shot && (
                <Shot
                  name={panel.shot}
                  alt="The Strata command palette listing recent and all pages."
                  width={900}
                  height={620}
                  sizes="(max-width: 1024px) 78vw, 34vw"
                />
              )}

              {panel.icon && (
                <panel.icon
                  className="h-8 w-8 text-primary"
                  aria-hidden
                />
              )}

              {panel.invert && (
                <div className="flex items-end gap-3">
                  <span className="h-16 w-16 rounded-md border bg-background" />
                  <span className="h-16 w-16 rounded-md bg-vivid" />
                  <span className="h-16 w-16 rounded-md border bg-foreground" />
                </div>
              )}
            </div>
          </SpotlightCard>
        ))}
      </HorizontalPan>
    </section>
  );
}

/* -------------------------------------------------------------------------
   Publishing. Two column with the real public page.
------------------------------------------------------------------------- */

export function PublishSection() {
  return (
    <section className="relative border-t bg-shell py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-x-14 gap-y-12 px-6 lg:grid-cols-2">
        <Reveal>
          <Globe className="h-6 w-6 text-primary" aria-hidden />
          <KineticHeading
            as="h2"
            text="Turn any note into a link"
            className="mt-5 font-serif text-3xl font-semibold tracking-[-0.025em] sm:text-5xl"
          />
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Publish a page and it gets a public address anyone can open. No
            account, no sidebar, no edit controls. Unpublish and the link stops
            working.
          </p>
          <p className="mt-8 inline-flex items-center rounded-md border bg-background px-3 py-2 font-mono text-sm">
            strata.app
            <span className="text-primary">/preview/your-note</span>
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <Parallax distance={26}>
            <Shot
              name="preview"
              alt="A published Strata note as visitors see it: the document with no sidebar and no editing controls."
              width={1400}
              height={950}
              sizes="(max-width: 1024px) 100vw, 550px"
            />
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   Keyboard. Rows, no cards, no media.
------------------------------------------------------------------------- */

const shortcuts = [
  { keys: ["Ctrl", "K"], label: "Open the command palette" },
  { keys: ["/"], label: "Insert a block from the editor" },
  { keys: ["Ctrl", "Alt", "1"], label: "Turn a line into a heading" },
  { keys: ["Ctrl", "Shift", "8"], label: "Start a bullet list" },
  { keys: ["Esc"], label: "Close a menu or stop renaming" },
];

export function KeyboardSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <KineticHeading
            as="h2"
            text="Reachable without the mouse"
            className="font-serif text-3xl font-semibold tracking-[-0.025em] sm:text-5xl"
          />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            The page tree, the palette and every menu take keyboard focus, and
            the shortcuts follow the conventions you already use.
          </p>
        </Reveal>

        <div className="mt-12 border-y">
          {shortcuts.map((shortcut, i) => (
            <Reveal key={shortcut.label} delay={i * 0.05}>
              <div className="group flex items-center gap-x-6 border-b py-4 last:border-b-0">
                <div className="flex shrink-0 items-center gap-x-1">
                  {shortcut.keys.map((key) => (
                    <kbd
                      key={key}
                      className="inline-flex h-7 min-w-7 select-none items-center justify-center rounded-sm border bg-muted px-2 font-mono text-[11px] font-medium text-muted-foreground transition-colors group-hover:border-vivid/50 group-hover:text-primary"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                  {shortcut.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   Built with. Real marks, in the page's one marquee.
------------------------------------------------------------------------- */

const stack = [
  { name: "Next.js", slug: "nextdotjs" },
  { name: "Convex", slug: "convex" },
  { name: "Clerk", slug: "clerk" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "React", slug: "react" },
];

export function StackSection() {
  return (
    <section className="border-y bg-shell py-14">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Built with
        </h2>
      </div>
      <div className="mt-8">
        <Marquee>
          {stack.map((item) => (
            <span
              key={item.name}
              className="flex shrink-0 items-center gap-3 text-lg font-medium text-muted-foreground"
            >
              <span
                aria-hidden
                className="h-6 w-6 bg-current"
                style={{
                  maskImage: `url(https://cdn.simpleicons.org/${item.slug})`,
                  WebkitMaskImage: `url(https://cdn.simpleicons.org/${item.slug})`,
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                }}
              />
              {item.name}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   Close.
------------------------------------------------------------------------- */

export function CtaSection() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <section className="relative isolate overflow-hidden py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(52% 48% at 50% 108%, hsl(var(--vivid) / 0.22), transparent 72%)",
        }}
      />
      <Reveal className="mx-auto max-w-2xl px-6 text-center">
        <KineticHeading
          as="h2"
          text="Start with one page"
          className="font-serif text-4xl font-semibold tracking-[-0.03em] sm:text-6xl"
        />
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
          Free, and yours from the first keystroke.
        </p>

        <div className="mt-10 flex justify-center">
          {(isLoading || !isAuthenticated) && (
            <Magnetic strength={0.4}>
              <SignInButton mode="modal">
                <Button size="lg" className="volt-glow">
                  Get Strata free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </SignInButton>
            </Magnetic>
          )}

          {!isLoading && isAuthenticated && (
            <Magnetic strength={0.4}>
              <Button size="lg" asChild className="volt-glow">
                <Link href="/documents">
                  Enter Strata
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Magnetic>
          )}
        </div>
      </Reveal>
    </section>
  );
}
