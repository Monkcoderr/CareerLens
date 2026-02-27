import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function DarkCTA() {
  const { user } = useAuth();

  return (
    <section className="section-padding">
      <div className="container-main">
        <div className="bg-surface-dark rounded-xl py-24 px-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="relative z-10">
            <h2 className="h2 text-white mb-6">Take Control of Your Job Search Today</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
              Join 50,000+ professionals using AI to land better roles faster. Start your journey for free.
            </p>
            <Link to={user ? '/dashboard' : '/register'}>
              <Button variant="primary" size="lg" className="px-12 py-4">
                {user ? 'Go to Dashboard' : 'Start Free Now'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}