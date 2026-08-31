interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalPageProps {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: LegalPageProps) {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 pb-24 pt-16">
      <header className="border-b pb-8">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {intro}
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Last updated {updated}
        </p>
      </header>

      <div className="divide-y">
        {sections.map((section) => (
          <section key={section.heading} className="py-8">
            <h2 className="text-lg font-semibold tracking-tight">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3">
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[0.95rem] leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
