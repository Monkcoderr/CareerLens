import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import API from '../../utils/api';

const COLORS = ['#6366f1', '#a855f7', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobStats, setJobStats] = useState({ stats: [], total: 0 });
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, interviewRes] = await Promise.allSettled([
          API.get('/jobs/stats/overview'),
          API.get('/ai/interview/history')
        ]);

        if (jobRes.status === 'fulfilled') setJobStats(jobRes.value.data);
        if (interviewRes.status === 'fulfilled') setInterviews(interviewRes.value.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    {
      label: 'Resume Score',
      value: `${user?.resumeScore || 0}%`,
      desc: 'ATS compatibility score',
      gradient: 'from-blue-600 to-cyan-600',
      bg: 'bg-blue-500/10',
      action: () => navigate('/resume')
    },
    {
      label: 'Interviews Done',
      value: user?.interviewsTaken || 0,
      desc: 'Mock sessions completed',
      gradient: 'from-purple-600 to-pink-600',
      bg: 'bg-purple-500/10',
      action: () => navigate('/interview')
    },
    {
      label: 'Avg. Score',
      value: `${user?.avgInterviewScore || 0}%`,
      desc: 'Interview performance',
      gradient: 'from-green-600 to-emerald-600',
      bg: 'bg-green-500/10',
      action: () => navigate('/interview')
    },
    {
      label: 'Jobs Tracked',
      value: jobStats.total || 0,
      desc: 'Total applications',
      gradient: 'from-orange-600 to-amber-600',
      bg: 'bg-orange-500/10',
      action: () => navigate('/jobs')
    }
  ];

  const interviewChartData = interviews
    .filter((i) => i.completedAt)
    .slice(0, 8)
    .reverse()
    .map((i, idx) => ({
      name: `Session ${idx + 1}`,
      score: i.overallScore || 0,
      role: i.role
    }));

  const jobPieData = jobStats.stats.map((s) => ({
    name: s._id.charAt(0).toUpperCase() + s._id.slice(1),
    value: s.count
  }));

  const quickActions = [
    { label: 'Analyze Resume', desc: 'Get AI-powered resume feedback', path: '/resume', emoji: '📄' },
    { label: 'Mock Interview', desc: 'Practice with AI interviewer', path: '/interview', emoji: '🎤' },
    { label: 'Cover Letter', desc: 'Generate tailored cover letters', path: '/cover-letter', emoji: '✉️' },
    { label: 'Track Jobs', desc: 'Manage your applications', path: '/jobs', emoji: '💼' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-400 mt-1">Here's your career preparation overview</p>
        </div>
        {user?.targetRole && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl border border-indigo-500/30">
            <span className="text-yellow-400">🎯</span>
            <span className="text-indigo-300 font-medium text-sm">{user.targetRole}</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, idx) => (
          <button
            key={idx}
            onClick={stat.action}
            className="text-left bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-gray-700 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 group"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <span className="text-white text-lg font-bold">
                {stat.label[0]}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            <p className="text-gray-600 text-xs mt-0.5">{stat.desc}</p>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="flex items-center gap-4 p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 rounded-xl transition-all duration-200 group text-left"
            >
              <span className="text-2xl">{action.emoji}</span>
              <div>
                <p className="text-white font-medium text-sm group-hover:text-indigo-300 transition-colors">
                  {action.label}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interview Progress */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📈 Interview Progress</h3>
          {interviewChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={interviewChartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" domain={[0, 100]} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={50}>
                  {interviewChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.score >= 70 ? '#22c55e' : entry.score >= 50 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[280px] text-gray-500">
              <span className="text-4xl mb-3">🎤</span>
              <p>Take your first mock interview!</p>
              <button
                onClick={() => navigate('/interview')}
                className="mt-3 px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600/30 transition text-sm"
              >
                Start Interview →
              </button>
            </div>
          )}
        </div>

        {/* Job Application Status */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">💼 Application Status</h3>
          {jobPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={jobPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {jobPieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[280px] text-gray-500">
              <span className="text-4xl mb-3">💼</span>
              <p>Start tracking your job applications!</p>
              <button
                onClick={() => navigate('/jobs')}
                className="mt-3 px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600/30 transition text-sm"
              >
                Add Job →
              </button>
            </div>
          )}
          {jobPieData.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {jobPieData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="text-gray-400 text-xs">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Interviews */}
      {interviews.length > 0 && (
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">🕐 Recent Interviews</h3>
          <div className="space-y-3">
            {interviews.slice(0, 5).map((interview) => (
              <div key={interview._id} className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl hover:bg-gray-800/60 transition">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold ${
                      (interview.overallScore || 0) >= 80
                        ? 'bg-green-900/50 text-green-400'
                        : (interview.overallScore || 0) >= 60
                        ? 'bg-yellow-900/50 text-yellow-400'
                        : 'bg-red-900/50 text-red-400'
                    }`}
                  >
                    {interview.overallScore || 0}%
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{interview.role}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {interview.type} • {interview.difficulty} •{' '}
                      {interview.questions?.length || 0} questions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 text-xs">
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </span>
                  {interview.completedAt && (
                    <p className="text-green-500 text-xs mt-0.5">✓ Completed</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}