import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import StyleGallery from "@/components/landing/StyleGallery";
import SocialProof from "@/components/landing/SocialProof";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import MarqueeStrip from "@/components/landing/Marquee";
import Difference from "@/components/landing/Difference";
import Steps from "@/components/landing/Steps";
import BackgroundsSection from "@/components/landing/Backgrounds";
import MockupsSection from "@/components/landing/Mockups";

export default function Home() {
  return (
    <div className="min-h-screen bg-void text-ink">
      <Navbar />
      <main>
        <Hero />
        <MarqueeStrip />
        <Difference
          beforeSrc="/rain-jukebox.png"
          afterSrc="/rain-jukebox-framerly.png"
        />
        <BackgroundsSection />
        <MockupsSection />
        <Features />
        <Steps />
        {/* <StyleGallery /> */}
        {/* <SocialProof /> */}
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
