import { Footer } from "./_components/Footer";
import { Heading } from "./_components/heading";
import { Grain, ScrollProgress } from "./_components/motion-primitives";
import {
  CapabilitiesSection,
  CtaSection,
  EditorSection,
  KeyboardSection,
  PublishSection,
  StackSection,
} from "./_components/sections";

const MarketingPage = () => {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <ScrollProgress />
      <Grain />
      <main className="flex-1">
        <Heading />
        <EditorSection />
        <CapabilitiesSection />
        <PublishSection />
        <KeyboardSection />
        <StackSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default MarketingPage;
