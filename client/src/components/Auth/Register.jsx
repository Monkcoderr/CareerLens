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
            Start Your <span className="text-primary-500">AI-Powered</span> Career Journey.
          </h2>
          <p className="body-large mb-12">
            Create your free account today and unlock professional grade tools to accelerate your path.
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

      {/* Right Panel: Register Card */}
      <div className="flex-1 flex items-center justify-center p-6 bg-surface-alt py-20">
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-[24px] shadow-heavy border border-border p-10">
            <h1 className="h2 mb-2 text-txt-primary">Create Account</h1>
            <p className="text-txt-muted mb-8 font-medium">Get started with CareerLens for free.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-txt-primary mb-2">Full Name *</label>
                <input name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-txt-primary mb-2">Email *</label>
                <input name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-txt-primary mb-2">Password *</label>
                <input name="password" type="password" placeholder="Min 6 characters" value={formData.password} onChange={handleChange} className={inputClass} required minLength={6} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-txt-primary mb-2">Target Role</label>
                <input name="targetRole" type="text" placeholder="e.g., Software Engineer" value={formData.targetRole} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-txt-primary mb-2">Experience</label>
                <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className={inputClass}>
                  <option value="fresher">Fresher (0 yrs)</option>
                  <option value="junior">Junior (1-2 yrs)</option>
                  <option value="mid">Mid-Level (3-5 yrs)</option>
                  <option value="senior">Senior (5+ yrs)</option>
                </select>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full !h-[52px] !rounded-[14px] !mt-6" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-[15px] font-medium text-txt-muted mt-10">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 font-bold hover:underline underline-offset-4">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}