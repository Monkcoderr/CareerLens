import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Product',
    links: [
      { label: 'Resume Analyzer', href: '#' },
      { label: 'Mock Interviews', href: '#' },
      { label: 'Cover Letters', href: '#' },
      { label: 'Market Insights', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '#' },
      { label: 'Success Stories', href: '#' },
      { label: 'Career Guide', href: '#' },
      { label: 'Help Center', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface-alt pt-24 pb-12 border-t border-border">
      <div className="container-main">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-txt-primary">CareerLens</span>
            </Link>
            <p className="text-sm text-txt-muted leading-relaxed">
              AI-powered career intelligence for high-achievers. Land your dream role faster than ever.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-bold text-txt-primary uppercase tracking-widest mb-6">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-[15px] text-txt-muted hover:text-primary-500 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[14px] text-txt-muted">
            © {new Date().getFullYear()} CareerLens AI platform. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-txt-muted hover:text-primary-500 transition-colors">Twitter</a>
            <a href="#" className="text-txt-muted hover:text-primary-500 transition-colors">LinkedIn</a>
            <a href="#" className="text-txt-muted hover:text-primary-500 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
