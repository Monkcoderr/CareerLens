import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import API from '../../utils/api';
import {
  FileText, MessageSquare, Target, Briefcase,
  ArrowRight, TrendingUp,
} from 'lucide-react';

const COLORS = ['#2563EB', '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobStats, setJobStats] = useState({ stats: [], total: 0 });
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [j, i] = await Promise.allSettled([
          API.get('/jobs/stats/overview'),
          API.get('/ai/interview/history'),
        ]);
        if (j.status === 'fulfilled') setJobStats(j.value.data);
        if (i.status === 'fulfilled') setInterviews(i.value.data);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetch();
  }, []);

  const stats = [
    { label: 'Resume Score', value: `${user?.resumeScore || 0}%`, icon: FileText, color: 'text-primary-500', bg: 'bg-primary-50', to: '/dashboard/resume' },
    { label: 'Interviews', value: user?.interviewsTaken || 0, icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-50', to: '/dashboard/interview' },
    { label: 'Avg Score', value: `${user?.avgInterviewScore || 0}%`, icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50', to: '/dashboard/interview' },
    { label: 'Jobs Tracked', value: jobStats.total || 0, icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-50', to: '/dashboard/jobs' },
  ];

  const chartData = interviews.filter(i => i.completedAt).slice(0, 8).reverse().map((i, idx) => ({
    name: `#${idx + 1}`, score: i.overallScore || 0,
  }));

  const pieData = jobStats.stats.map(s => ({
    name: s._id.charAt(0).toUpperCase() + s._id.slice(1), value: s.count,
  }));

  const quickActions = [
    { label: 'Analyze Resume', desc: 'Get AI-powered feedback', path: '/dashboard/resume', emoji: '📄' },
    { label: 'Mock Interview', desc: 'Practice with AI', path: '/dashboard/interview', emoji: '🎤' },
    { label: 'Cover Letter', desc: 'Generate tailored letters', path: '/dashboard/cover-letter', emoji: '✉️' },
    { label: 'Track Jobs', desc: 'Manage applications', path: '/dashboard/jobs', emoji: '💼' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-80">
      <div className="w-8 h-8 border-[3px] border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">
            Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-txt-muted text-sm mt-1">Here's your career preparation overview</p>
        </div>
        {user?.targetRole && (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-primary-50 rounded-xl border border-primary-100">
            <Target size={14} className="text-primary-500" />
            <span className="text-primary-600 text-sm font-medium">{user.targetRole}</span>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <Card
            key={idx}
            hover
            className="p-5 cursor-pointer"
            onClick={() => navigate(s.to)}
          >
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon size={18} className={s.color} />
            </div>
            <p className="text-2xl font-bold text-txt-primary">{s.value}</p>
            <p className="text-sm text-txt-muted mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-txt-primary mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-primary-500" /> Quick Actions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map(a => (
            <button
              key={a.path}
              onClick={() => navigate(a.path)}
              className="flex items-center gap-3 p-3.5 bg-surface rounded-xl border border-border hover:border-primary-200 hover:bg-primary-50/30 transition-all group text-left"
            >
              <span className="text-xl">{a.emoji}</span>
              <div>
                <p className="text-sm font-medium text-txt-primary group-hover:text-primary-600 transition">{a.label}</p>
                <p className="text-xs text-txt-light">{a.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-txt-primary mb-5">Interview Progress</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '13px' }} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={chartData[i].score >= 70 ? '#10B981' : chartData[i].score >= 50 ? '#F59E0B' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[240px]">
              <span className="text-3xl mb-2">🎤</span>
              <p className="text-txt-muted text-sm mb-3">No interviews yet</p>
              <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/interview')}>
                Start First Interview <ArrowRight size={14} />
              </Button>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-txt-primary mb-5">Application Status</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '13px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-xs text-txt-muted">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[240px]">
              <span className="text-3xl mb-2">💼</span>
              <p className="text-txt-muted text-sm mb-3">No jobs tracked yet</p>
              <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/jobs')}>
                Add First Job <ArrowRight size={14} />
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Interviews */}
      {interviews.length > 0 && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-txt-primary mb-4">Recent Interviews</h3>
          <div className="space-y-2">
            {interviews.slice(0, 5).map(iv => (
              <div key={iv._id} className="flex items-center justify-between p-3.5 bg-surface rounded-xl border border-border-light hover:border-border transition">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${
                    (iv.overallScore||0)>=80?'bg-emerald-50 text-emerald-600':
                    (iv.overallScore||0)>=60?'bg-amber-50 text-amber-600':'bg-red-50 text-red-500'
                  }`}>{iv.overallScore||0}%</div>
                  <div>
                    <p className="text-sm font-medium text-txt-primary">{iv.role}</p>
                    <p className="text-xs text-txt-light">{iv.type} · {iv.difficulty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-txt-light">{new Date(iv.createdAt).toLocaleDateString()}</p>
                  {iv.completedAt && <p className="text-xs text-emerald-500 font-medium">✓ Done</p>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}