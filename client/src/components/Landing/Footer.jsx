import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Resume Analyzer', href: '/register' },
      { label: 'Mock Interviews', href: '/register' },
      { label: 'Cover Letters', href: '/register' },
      { label: 'Job Tracker', href: '/register' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { label: 'ATS Score Checker', href: '/register' },
      { label: 'Skill Gap Analysis', href: '/register' },
      { label: 'Interview Prep', href: '/register' },
      { label: 'Career Roadmap', href: '/register' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Data Security', href: '#' },
      { label: 'Contact Us', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border">
      <div className="container-main section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-txt-primary">CareerLens</span>
            </Link>
            <p className="text-sm text-txt-muted leading-relaxed max-w-xs">
              AI-powered career intelligence platform helping professionals
              land their dream jobs.
            </p>
          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-txt-primary mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-txt-muted hover:text-txt-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-txt-light">
            © {new Date().getFullYear()} CareerLens. All rights reserved.
          </p>
          <p className="text-sm text-txt-light">
            Built with AI & ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}