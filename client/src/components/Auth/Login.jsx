import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import { FileText, MessageSquare, BarChart3, CheckCircle2 } from 'lucide-react';

const perks = [
  { icon: FileText, text: 'AI-powered resume optimization' },
  { icon: MessageSquare, text: 'Realistic mock interview practice' },
  { icon: BarChart3, text: 'Live career market insights' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  const inputClass = 'w-full h-[52px] px-5 border border-border rounded-[14px] text-txt-primary placeholder:text-txt-muted bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200';

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel: Blue Gradient */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient p-16 flex-col justify-center border-r border-border">
        <Link to="/" className="flex items-center gap-2.5 mb-24">
          <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center text-white shadow-soft">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-txt-primary tracking-tight">CareerLens</span>
        </Link>

        <div className="max-w-md">
          <h2 className="text-5xl font-bold text-txt-primary mb-6 leading-tight">
            Accelerate your <span className="text-primary-500">career growth</span> with AI.
          </h2>
          <p className="body-large mb-12">
            Join 50,000+ professionals using intelligent tools to land better roles, faster.
          </p>

          <div className="space-y-6">
            {perks.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-soft group-hover:shadow-heavy transition-all duration-300">
                  <Icon size={20} className="text-primary-500" />
                </div>
                <span className="text-[17px] font-semibold text-txt-primary">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Login Card */}
      <div className="flex-1 flex items-center justify-center p-6 bg-surface-alt">
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-[24px] shadow-heavy border border-border p-10">
            <h1 className="h2 mb-2 text-txt-primary">Welcome Back</h1>
            <p className="text-txt-muted mb-8 font-medium">Please enter your details to sign in.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-txt-primary mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-txt-primary">Password</label>
                  <a href="#" className="text-[13px] font-bold text-primary-500 hover:text-primary-600">Forgot Password?</a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                  required
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full !h-[52px] !rounded-[14px]" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="bg-white px-4 text-txt-muted">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 h-[52px] border border-border rounded-[14px] text-sm font-bold text-txt-primary hover:bg-surface-alt transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-3 h-[52px] border border-border rounded-[14px] text-sm font-bold text-txt-primary hover:bg-surface-alt transition-all">
                <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                LinkedIn
              </button>
            </div>

            <p className="text-center text-[15px] font-medium text-txt-muted mt-10">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-500 font-bold hover:underline underline-offset-4">Sign up for free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}