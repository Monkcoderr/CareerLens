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
      {/* Logo */}
      <div className="h-[72px] flex items-center px-6 border-b border-border">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-txt-primary">CareerLens</span>
        </a>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-semibold text-txt-light uppercase tracking-wider mb-2">Menu</p>
        {navItems.map(({ path, label, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-txt-muted hover:text-txt-primary hover:bg-slate-50'
              }`
            }
          >
            <Icon size={18} />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-txt-primary truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-txt-light truncate">{user?.targetRole || 'Set target role'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-txt-light hover:text-red-500 hover:bg-red-50 transition flex-shrink-0"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}