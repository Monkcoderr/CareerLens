import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Resources', href: '#resources' },
  { label: 'Blog', href: '#blog' },
];

export default function Navbar() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border h-[72px] flex items-center">
      <div className="container-main w-full">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center text-white shadow-soft">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-txt-primary tracking-tight">CareerLens</span>
          </Link>

          {/* Center: Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[15px] font-medium text-txt-muted hover:text-primary-500 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: Desktop CTA */}
          <div className="hidden md:flex items-center gap-6">
            {!user && (
              <Link to="/login" className="text-[15px] font-semibold text-txt-primary hover:text-primary-500 transition-colors">
                Log in
              </Link>
            )}
            <Link to={user ? "/dashboard" : "/register"}>
              <Button variant="primary" size="md">
                {user ? "Dashboard" : "Start Free"}
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-txt-muted hover:text-txt-primary"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="absolute top-[72px] left-0 right-0 bg-white border-b border-border p-6 md:hidden animate-fade-in shadow-heavy">
            <div className="flex flex-col gap-4 mb-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-medium text-txt-primary"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {!user && (
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" size="lg" className="w-full">Log in</Button>
                </Link>
              )}
              <Link to={user ? "/dashboard" : "/register"} onClick={() => setMobileOpen(false)}>
                <Button variant="primary" size="lg" className="w-full">
                  {user ? "Dashboard" : "Start Free"}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
