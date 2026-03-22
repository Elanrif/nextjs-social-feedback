import CTASection from "@/components/features/cta-section";
import { Footer } from "@/components/features/footer";
import GettingStartedSection from "@/components/features/getting-started-section";
import { Header } from "@/components/features/header";
import Hero from "@/components/features/hero";

export const metadata = {
  title: "Kickstart Next.js - Modern Boilerplate",
  description:
    "Kickstart your Next.js project with a modern boilerplate" +
    "featuring authentication, dashboard, and more.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <GettingStartedSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
