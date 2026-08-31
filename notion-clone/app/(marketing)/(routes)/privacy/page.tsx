import type { Metadata } from "next";

import { LegalPage } from "../../_components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Strata stores, who processes it, and how to remove your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="31 August 2026"
      intro="Strata is a personal document workspace. This page describes exactly what it stores and who can read it."
      sections={[
        {
          heading: "What is stored",
          body: [
            "Your pages: their title, icon, cover image, body content, and where they sit in your page tree.",
            "An account identifier from your sign-in provider, used to attach pages to you.",
            "Nothing else. There is no analytics, no advertising, and no third-party tracking on this site.",
          ],
        },
        {
          heading: "Who processes it",
          body: [
            "Clerk handles sign-in and holds your account details.",
            "Convex stores your pages and serves them to you.",
            "EdgeStore stores cover images and any files you upload into a page.",
            "Each provider processes data only to run the feature it backs.",
          ],
        },
        {
          heading: "Published pages",
          body: [
            "A page is private until you press Publish on it. Publishing gives that one page a public link that anyone holding the link can read.",
            "Unpublishing removes public access. Published pages are not listed in search engines by Strata, but a link you share can be indexed by anyone who publishes it elsewhere.",
          ],
        },
        {
          heading: "Deleting your data",
          body: [
            "Moving a page to the Trash hides it but keeps it recoverable. Deleting it from the Trash removes it permanently.",
            "To remove your account and everything in it, contact the address below.",
          ],
        },
        {
          heading: "Contact",
          body: [
            "Questions about this policy can go to the maintainer through the project repository.",
          ],
        },
      ]}
    />
  );
}
