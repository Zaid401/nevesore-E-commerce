import CategoryGrid from "@/components/category";
import CallToAction from "@/components/cta";
import FaqSection from "@/components/faq";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import WhyChooseUs from "@/components/why-choose-us";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <Navbar />
      <Hero />
      <CategoryGrid />
      <WhyChooseUs />
      <FaqSection />
      <CallToAction />
      <Footer />
    </main>
  );
}
