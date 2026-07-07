import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Screenshots } from "@/components/sections/Screenshots";
import { WhyBlockify } from "@/components/sections/WhyBlockify";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { JoinBeta } from "@/components/sections/JoinBeta";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-x-hidden">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Screenshots />
        <WhyBlockify />
        <Testimonials />
        <FAQ />
        <JoinBeta />
      </main>
      <Footer />
    </>
  );
}
