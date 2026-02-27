import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, MessageSquare,
  FileEdit, Briefcase, LogOut, ChevronRight,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/dashboard/resume', label: 'Resume Analyzer', icon: FileText },
  { path: '/dashboard/interview', label: 'Mock Interview', icon: MessageSquare },
  { path: '/dashboard/cover-letter', label: 'Cover Letter', icon: FileEdit },
  { path: '/dashboard/jobs', label: 'Job Tracker', icon: Briefcase },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-border flex flex-col z-50">
      {/* Brand Logo */}
      <div className="h-[72px] flex items-center px-6 border-b border-border">
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center text-white shadow-soft group-hover:shadow-heavy transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-txt-primary tracking-tight">CareerLens</span>
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 space-y-1.5 overflow-y-auto">
        <p className="px-4 text-[11px] font-bold text-txt-muted uppercase tracking-widest mb-4">Core Platform</p>

        {navItems.map(({ path, label, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 group ${isActive
                ? 'bg-primary-500 text-white shadow-soft'
                : 'text-txt-muted hover:text-txt-primary hover:bg-surface-alt'
              }`
            }
          >
            <Icon size={18} />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${window.location.pathname === path ? 'hidden' : ''}`} />
          </NavLink>
        ))}
      </nav>

      {/* User Session */}
      <div className="p-4 border-t border-border bg-surface-alt/30">
        <div className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-border hover:bg-white transition-all group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-soft">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-txt-primary truncate">{user?.name || 'User Account'}</p>
            <p className="text-[12px] font-medium text-txt-muted truncate capitalize">{user?.targetRole || 'Professional'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-txt-muted hover:text-red-500 hover:bg-red-50 transition-all"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}