import type { Metadata } from "next";

import { LegalPage } from "../../_components/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that apply to using Strata, including what it does and does not guarantee.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="31 August 2026"
      intro="Strata is a personal project offered as-is. These terms set out what you can expect from it and what it expects from you."
      sections={[
        {
          heading: "Using Strata",
          body: [
            "You need an account to create pages. You are responsible for what you write and for anything you publish to a public link.",
            "Do not use Strata to store or publish unlawful material, or to publish other people's private information.",
          ],
        },
        {
          heading: "Your content is yours",
          body: [
            "You keep every right you have in what you write. Strata claims no ownership over your pages.",
            "Publishing a page grants nothing beyond making that page readable to anyone with the link, until you unpublish it.",
          ],
        },
        {
          heading: "Availability and backups",
          body: [
            "Strata is provided without a service level guarantee and without a guarantee of availability.",
            "Keep your own copies of anything you cannot afford to lose. Export important pages regularly.",
          ],
        },
        {
          heading: "Ending access",
          body: [
            "You can stop using Strata at any time and delete your pages from the Trash.",
            "Accounts used to publish unlawful material may be removed.",
          ],
        },
        {
          heading: "Changes",
          body: [
            "These terms may change as the product changes. The date at the top of this page reflects the most recent revision.",
          ],
        },
      ]}
    />
  );
}
