import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function DarkCTA() {
  const { user } = useAuth();

  return (
    <section id="cta" className="section-padding px-5 sm:px-6">
      <div className="max-w-5xl mx-auto bg-surface-dark rounded-3xl py-16 sm:py-20 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          Ready to elevate your career?
        </h2>
        <p className="text-slate-400 text-lg max-w-md mx-auto mb-10">
          Join thousands of professionals using AI to land better roles faster.
        </p>
        <Link to={user ? '/dashboard' : '/register'}>
          <Button variant="primary" size="xl" className="shadow-hero">
            {user ? 'Go to Dashboard' : 'Get Started — It\'s Free'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </Link>
      </div>
    </section>
  );
}