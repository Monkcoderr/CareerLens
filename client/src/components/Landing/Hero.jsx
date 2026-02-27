import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { Shield, Zap, BarChart3 } from 'lucide-react';

const trustBadges = [
  { icon: Zap, label: 'AI-Powered' },
  { icon: BarChart3, label: 'Real-Time Insights' },
  { icon: Shield, label: 'Secure & Private' },
];

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="hero-gradient pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden">
      <div className="container-main">
        <div className="max-w-[800px] mx-auto text-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-100 text-primary-500 text-sm font-semibold mb-8 animate-fade-in shadow-soft">
            AI-Powered Career Intelligence
          </div>

          {/* H1 Headline */}
          <h1 className="h1 text-txt-primary mb-8 animate-slide-up">
            Land Your <span className="text-primary-500">Dream Role</span> <br className="hidden md:block" />
            Without the Stress.
          </h1>

          {/* Subtext */}
          <p className="body-large mb-12 animate-slide-up delay-100">
            AI resume analysis, tailored cover letters, mock interviews, and live job market insights — all in one platform designed for high-achievers.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-slide-up delay-200">
            <Link to={user ? "/dashboard" : "/register"}>
              <Button variant="primary" size="lg" className="text-[15px]">
                {user ? "Go to Dashboard" : "Start For Free"}
              </Button>
            </Link>
            <a href="#features" className="text-[15px] font-semibold text-txt-muted hover:text-primary-500 transition-colors flex items-center gap-1.5">
              See how it works
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Social Proof */}
          <div className="animate-fade-in delay-300">
            <p className="text-[13px] font-semibold text-txt-muted uppercase tracking-widest mb-8">
              Trusted by users at world-class companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
              {/* Using generic placeholders for logos */}
              <div className="text-xl font-bold">GOOGLE</div>
              <div className="text-xl font-bold">META</div>
              <div className="text-xl font-bold">STRIPE</div>
              <div className="text-xl font-bold">AIRBNB</div>
              <div className="text-xl font-bold">AMAZON</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
