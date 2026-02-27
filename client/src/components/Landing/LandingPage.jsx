import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import ToolGrid from './ToolGrid';
import Trust from './Trust';
import Pricing from './Pricing';
import FAQ from './FAQ';
import DarkCTA from './DarkCTA';
import Footer from './Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-primary-100 selection:text-primary-900">
      <Navbar />
      <Hero />
      <Features />
      <ToolGrid />
      <Trust />
      <Pricing />
      <FAQ />
      <DarkCTA />
      <Footer />
    </div>
  );
}