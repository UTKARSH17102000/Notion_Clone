import "./globals.css";
import { Toaster } from "sonner";
import { Instrument_Sans, Source_Serif_4 } from "next/font/google";
import type { Metadata } from "next";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";

// Chrome, marketing and UI.
const sans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

// The document canvas. A text face for a reading surface.
const serif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: {
    default: "Strata",
    template: "%s | Strata",
  },
  description:
    "A fast personal document workspace. Write in a calm editor, nest pages as deep as you think, and publish any note as a public link.",
  applicationName: "Strata",
  openGraph: {
    type: "website",
    siteName: "Strata",
    title: "Strata",
    description:
      "A fast personal document workspace. Write in a calm editor, nest pages as deep as you think, and publish any note as a public link.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Strata",
    description: "A fast personal document workspace.",
  },
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.svg",
        href: "/logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-dark.svg",
        href: "/logo-dark.svg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          sans.variable,
          serif.variable,
          "font-sans antialiased"
        )}
      >
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="strata-theme"
            >
              <Toaster position="bottom-center" />
              <ModalProvider />
              {children}
            </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
