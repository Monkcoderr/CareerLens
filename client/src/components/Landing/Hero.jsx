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
    <section className="bg-surface min-h-[85vh] flex items-center">
      <div className="container-main w-full section-padding">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-500 px-4 py-1.5 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <Zap size={14} />
            <span>Powered by Advanced AI</span>
          </div>

          {/* Headline */}
          <h1 className="heading-1 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            The Professional Way to{' '}
            <br className="hidden sm:block" />
            <span className="text-primary-500">Build & Advance</span> Your Career
          </h1>

          {/* Subtext */}
          <p
            className="body-large max-w-xl mx-auto mb-10 animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            Analyze your resume with AI, practice mock interviews, generate
            tailored cover letters, and track every application — all in one platform.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 animate-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            <Link to={user ? '/dashboard' : '/register'}>
              <Button variant="primary" size="xl" className="shadow-hero">
                {user ? 'Go to Dashboard' : 'Get Started Free'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="xl">
                See How It Works
              </Button>
            </a>
          </div>

          {/* Trust Badges */}
          <div
            className="flex flex-wrap items-center justify-center gap-6 animate-slide-up"
            style={{ animationDelay: '0.4s' }}
          >
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-txt-muted text-sm">
                <Icon size={16} className="text-primary-500" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}