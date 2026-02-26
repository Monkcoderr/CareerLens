import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import { FileText, MessageSquare, BarChart3 } from 'lucide-react';

const perks = [
  { icon: FileText, text: 'AI-powered resume scoring & optimization' },
  { icon: MessageSquare, text: 'Realistic mock interview practice' },
  { icon: BarChart3, text: 'Live career market insights' },
];

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', targetRole: '', experienceLevel: 'fresher',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields'); return;
    }
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(formData);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  const inputClass = 'w-full h-12 px-4 border border-border rounded-xl text-txt-primary placeholder-txt-light bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-sm';

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-primary-500 to-indigo-600 p-12 xl:p-16 flex-col justify-center relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-white">CareerLens</span>
          </Link>
          <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
            Start Your AI-Powered
            <br />
            Career Journey
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-sm leading-relaxed">
            Create a free account and unlock intelligent career tools.
          </p>
          <ul className="space-y-5">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <span className="text-white/90 text-[15px] font-medium">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-surface">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-txt-primary">CareerLens</span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-elevated border border-border p-8 sm:p-10">
            <h1 className="text-2xl font-bold text-txt-primary mb-1">Create your account</h1>
            <p className="text-txt-muted text-sm mb-8">Get started with CareerLens for free</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-1.5">Full Name *</label>
                <input name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-1.5">Email *</label>
                <input name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-1.5">Password *</label>
                <input name="password" type="password" placeholder="Min 6 characters" value={formData.password} onChange={handleChange} className={inputClass} required minLength={6} />
              </div>
              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-1.5">Target Role</label>
                <input name="targetRole" type="text" placeholder="e.g., Full Stack Developer" value={formData.targetRole} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-1.5">Experience</label>
                <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className={inputClass}>
                  <option value="fresher">Fresher (0 yrs)</option>
                  <option value="junior">Junior (1-2 yrs)</option>
                  <option value="mid">Mid-Level (3-5 yrs)</option>
                  <option value="senior">Senior (5+ yrs)</option>
                  <option value="lead">Lead / Manager</option>
                </select>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full !mt-6" disabled={loading}>
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-sm text-txt-muted mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-600 transition">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}