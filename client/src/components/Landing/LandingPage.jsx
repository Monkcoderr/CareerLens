import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import Trust from './Trust';
import DarkCTA from './DarkCTA';
import Footer from './Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <Hero />
      <Features />
      <Trust />
      <DarkCTA />
      <Footer />
    </div>
  );
}