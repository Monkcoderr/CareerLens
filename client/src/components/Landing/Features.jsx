import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import { FileText, Mail, MessageSquare, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Resume Intelligence',
    desc: 'Get instant AI-powered ATS scoring, keyword analysis, and actionable improvement suggestions.',
    link: '/register',
    cta: 'Try now',
  },
  {
    icon: Mail,
    title: 'AI Cover Letters',
    desc: 'Generate role-specific, personalized cover letters that match job descriptions perfectly.',
    link: '/register',
    cta: 'Try now',
  },
  {
    icon: MessageSquare,
    title: 'Mock AI Interviews',
    desc: 'Practice with realistic AI-generated questions and receive detailed performance feedback.',
    link: '/register',
    cta: 'Try now',
  },
  {
    icon: TrendingUp,
    title: 'Job Tracker',
    desc: 'Organize all your applications with a visual Kanban board and never miss a follow-up.',
    link: '/register',
    cta: 'Try now',
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white section-padding">
      <div className="container-main">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="heading-2 mb-4">Core Intelligence Tools</h2>
          <p className="body-large">
            Everything you need to land your dream job, powered by artificial intelligence.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((f) => (
            <Card key={f.title} hover className="p-6 lg:p-8 group">
              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center mb-5 group-hover:bg-primary-100 transition-colors">
                <f.icon size={20} className="text-primary-500" />
              </div>

              {/* Text */}
              <h3 className="heading-3 mb-2">{f.title}</h3>
              <p className="text-sm text-txt-muted leading-relaxed mb-4">{f.desc}</p>

              {/* Link */}
              <Link
                to={f.link}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary-500 hover:text-primary-600 hover:underline underline-offset-4 transition"
              >
                {f.cta}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}