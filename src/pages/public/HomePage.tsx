import { BlogSection } from "@/components/pages/home/BlogSection";
import { CtaSection } from "@/components/pages/home/CtaSection";
import { HeroSection } from "@/components/pages/home/HeroSection";
import { ServicesSection } from "@/components/pages/home/ServicesSection";
import { TestimonialsSection } from "@/components/pages/home/TestimonialsSection";

const HomePage = () => {
  return (
    // O PublicLayout (no App.tsx) cuida do Header e do Footer.
    // A HomePage apenas organiza as seções de seu conteúdo.
    <>
      <HeroSection />
      <ServicesSection />
      <TestimonialsSection />
      <BlogSection />
      <CtaSection />
    </>
  );
};

export default HomePage;