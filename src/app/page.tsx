import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import StyleGallery from "@/components/landing/StyleGallery";
import SocialProof from "@/components/landing/SocialProof";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-void text-ink">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <StyleGallery />
        <SocialProof />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
