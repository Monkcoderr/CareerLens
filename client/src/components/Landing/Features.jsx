import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const sections = [
  {
    title: 'Resume Intelligence Engine',
    desc: 'Get instant AI-powered ATS scoring, keyword analysis, and actionable improvement suggestions to beat the bots.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800',
    tag: 'Analysis',
  },
  {
    title: 'AI Cover Letter Personalizer',
    desc: 'Generate role-specific, personalized cover letters that match job descriptions perfectly in seconds.',
    image: 'https://images.unsplash.com/photo-1512428559083-a4979b2b51ff?auto=format&fit=crop&q=80&w=800',
    tag: 'Personalization',
    reverse: true,
  },
  {
    title: 'Mock Interview Simulator',
    desc: 'Practice with realistic AI-generated questions and receive detailed performance feedback on your answers.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800',
    tag: 'Simulation',
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white">
      {/* Problem/Solution Split */}
      <div className="section-padding bg-surface-alt">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="p-8 md:p-12 bg-red-50 rounded-xl border border-red-100 shadow-soft">
              <span className="text-3xl mb-4 block">😫</span>
              <h3 className="h3 text-red-900 mb-4">Manual Job Search Struggles</h3>
              <ul className="space-y-3 text-red-800/70 font-medium">
                <li>• Generic resumes ignored by ATS</li>
                <li>• Hours spent on each cover letter</li>
                <li>• Interview anxiety and lack of prep</li>
                <li>• Fragmented application tracking</li>
              </ul>
            </div>

            <div className="p-8 md:p-12 bg-emerald-50 rounded-xl border border-emerald-100 shadow-soft relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span className="text-3xl mb-4 block">🚀</span>
              <h3 className="h3 text-emerald-900 mb-4">With AI Career Intelligence</h3>
              <ul className="space-y-3 text-emerald-800/70 font-medium">
                <li>• Optimized resumes that rank top</li>
                <li>• Instant tailored cover letters</li>
                <li>• AI-driven interview confidence</li>
                <li>• Unified, smart job tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="py-20 bg-primary-900 text-white overflow-hidden relative">
        <div className="container-main relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">1M+</p>
              <p className="text-primary-100 font-medium uppercase tracking-wider text-sm">Resumes Analyzed</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">60%</p>
              <p className="text-primary-100 font-medium uppercase tracking-wider text-sm">Interview Improvement</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">2x</p>
              <p className="text-primary-100 font-medium uppercase tracking-wider text-sm">Faster Job Placement</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link to="/register">
              <Button variant="primary" size="lg" className="bg-white text-primary-900 hover:bg-primary-50">
                Start Growing Your Career
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Sections (Alternating) */}
      <div className="section-padding space-y-32">
        {sections.map((s, idx) => (
          <div key={idx} className="container-main">
            <div className={`flex flex-col ${s.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-24`}>
              <div className="flex-1 space-y-6">
                <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-500 text-[13px] font-bold uppercase tracking-wider">
                  {s.tag}
                </span>
                <h2 className="h2 text-txt-primary">{s.title}</h2>
                <p className="body-large">{s.desc}</p>
                <Link to="/register" className="inline-flex items-center gap-2 text-primary-500 font-bold hover:gap-3 transition-all">
                  Try {s.tag.toLowerCase()} <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
              </div>
              <div className="flex-1 w-full">
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary-50 rounded-2xl -z-10 rotate-2"></div>
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full aspect-[4/3] object-cover rounded-xl shadow-heavy border border-border"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}