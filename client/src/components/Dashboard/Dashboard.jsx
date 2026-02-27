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
  ArrowRight, TrendingUp, Sparkles
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
    { label: 'Analyze Resume', desc: 'Get AI-powered feedback', path: '/dashboard/resume', emoji: '📄', color: 'bg-blue-50 text-blue-600' },
    { label: 'Mock Interview', desc: 'Practice with AI', path: '/dashboard/interview', emoji: '🎤', color: 'bg-purple-50 text-purple-600' },
    { label: 'Cover Letter', desc: 'Generate tailored letters', path: '/dashboard/cover-letter', emoji: '✉️', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Track Jobs', desc: 'Manage applications', path: '/dashboard/jobs', emoji: '💼', color: 'bg-amber-50 text-amber-600' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-[3px] border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="h2 text-txt-primary">
            Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="body-large mt-1">Here's your career preparation overview for today.</p>
        </div>
        {user?.targetRole && (
          <div className="flex items-center gap-2.5 px-4 py-2 bg-white rounded-full border border-border shadow-soft">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
            <span className="text-[13px] font-bold text-txt-primary uppercase tracking-wider">{user.targetRole}</span>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <Card
            key={idx}
            hover
            className="p-6 cursor-pointer border-0 shadow-soft"
            onClick={() => navigate(s.to)}
          >
            <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mb-5`}>
              <s.icon size={22} className={s.color} />
            </div>
            <p className="text-3xl font-bold text-txt-primary tracking-tight">{s.value}</p>
            <p className="text-sm font-semibold text-txt-muted mt-1 uppercase tracking-wider">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="p-8 border-0 shadow-soft bg-primary-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles size={48} /></div>
            <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map(a => (
                <button
                  key={a.path}
                  onClick={() => navigate(a.path)}
                  className="w-full flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group border border-white/10"
                >
                  <span className="text-xl">{a.emoji}</span>
                  <div className="text-left">
                    <p className="text-sm font-bold">{a.label}</p>
                    <p className="text-[11px] text-white/60">{a.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-8 border-0 shadow-soft">
            <h3 className="text-sm font-bold text-txt-primary mb-6 uppercase tracking-widest">Application Status</h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} cornerRadius={4} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3 mt-6">
                  {pieData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-alt transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                        <span className="text-sm font-semibold text-txt-primary">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-txt-muted">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-12 text-center">
                <p className="text-txt-muted text-sm mb-4">No data yet</p>
                <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/jobs')}>Add Job</Button>
              </div>
            )}
          </Card>
        </div>

        {/* Charts & History */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 border-0 shadow-soft">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-txt-primary uppercase tracking-widest">Interview Performance</h3>
              <div className="flex items-center gap-2 text-primary-500 text-xs font-bold">
                <TrendingUp size={14} /> 12% increase
              </div>
            </div>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ background: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="score" radius={[6, 6, 6, 6]} barSize={32}>
                    {chartData.map((d, i) => (
                      <Cell key={i} fill={d.score >= 70 ? '#10B981' : d.score >= 50 ? '#F59E0B' : '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-surface-alt flex items-center justify-center mb-4"><MessageSquare className="text-txt-muted" /></div>
                <p className="text-txt-muted text-sm font-medium">Practice your first mock interview <br /> to see analytics.</p>
              </div>
            )}
          </Card>

          <Card className="p-8 border-0 shadow-soft">
            <h3 className="text-sm font-bold text-txt-primary mb-6 uppercase tracking-widest">Recent Activity</h3>
            <div className="space-y-4">
              {interviews.length > 0 ? (
                interviews.slice(0, 4).map(iv => (
                  <div key={iv._id} className="flex items-center justify-between p-4 bg-surface-alt/50 rounded-2xl border border-transparent hover:border-border transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold shadow-soft ${(iv.overallScore || 0) >= 80 ? 'bg-emerald-50 text-emerald-600' :
                          (iv.overallScore || 0) >= 60 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'
                        }`}>{(iv.overallScore || 0)}%</div>
                      <div>
                        <p className="text-[15px] font-bold text-txt-primary">{iv.role}</p>
                        <p className="text-[12px] font-medium text-txt-muted uppercase tracking-wider">{iv.type} · {iv.difficulty}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div className="hidden sm:block">
                        <p className="text-[12px] font-bold text-txt-primary">{new Date(iv.createdAt).toLocaleDateString()}</p>
                        <p className="text-[11px] text-txt-muted">Completed</p>
                      </div>
                      <ArrowRight size={18} className="text-txt-muted group-hover:text-primary-500 transition-colors" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-txt-muted text-sm font-medium">No recent activity detected.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}