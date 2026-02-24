import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../../utils/api';

const STATUS_CONFIG = {
  saved: { label: 'Saved', color: 'bg-gray-700 text-gray-300', emoji: '🔖' },
  applied: { label: 'Applied', color: 'bg-blue-900/50 text-blue-400', emoji: '📨' },
  interviewing: { label: 'Interviewing', color: 'bg-purple-900/50 text-purple-400', emoji: '🎤' },
  offered: { label: 'Offered', color: 'bg-green-900/50 text-green-400', emoji: '🎉' },
  rejected: { label: 'Rejected', color: 'bg-red-900/50 text-red-400', emoji: '❌' },
  accepted: { label: 'Accepted', color: 'bg-emerald-900/50 text-emerald-400', emoji: '✅' }
};

const KANBAN_COLUMNS = ['saved', 'applied', 'interviewing', 'offered'];

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    salary: '',
    url: '',
    status: 'saved',
    notes: ''
  });

  const fetchJobs = async () => {
    try {
      const { data } = await API.get('/jobs');
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const addJob = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.position) {
      toast.error('Company and position are required');
      return;
    }
    try {
      await API.post('/jobs', formData);
      toast.success('Job added! 💼');
      setShowModal(false);
      setFormData({ company: '', position: '', location: '', salary: '', url: '', status: 'saved', notes: '' });
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add job');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/jobs/${id}`, { status });
      fetchJobs();
      toast.success(`Status → ${STATUS_CONFIG[status].label}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Remove this job application?')) return;
    try {
      await API.delete(`/jobs/${id}`);
      fetchJobs();
      toast.success('Job removed');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            💼 Job Application Tracker
          </h1>
          <p className="text-gray-400 mt-2">
            Track and manage all your job applications in one place
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all flex items-center gap-2 shadow-lg shadow-orange-500/25 self-start"
        >
          + Add Job
        </button>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const count = jobs.filter((j) => j.status === key).length;
          if (count === 0) return null;
          return (
            <div key={key} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${config.color}`}>
              {config.emoji} {config.label}: {count}
            </div>
          );
        })}
        {jobs.length > 0 && (
          <div className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-900/50 text-indigo-400">
            📊 Total: {jobs.length}
          </div>
        )}
      </div>

      {/* Kanban Board */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {KANBAN_COLUMNS.map((status) => (
            <div key={status} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${STATUS_CONFIG[status].color}`}>
                  {STATUS_CONFIG[status].emoji} {STATUS_CONFIG[status].label}
                </span>
                <span className="text-gray-600 text-xs font-medium">
                  {jobs.filter((j) => j.status === status).length}
                </span>
              </div>

              <div className="space-y-3 min-h-[120px]">
                {jobs
                  .filter((j) => j.status === status)
                  .map((job) => (
                    <div
                      key={job._id}
                      className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium text-sm truncate">{job.position}</h3>
                          <p className="text-gray-400 text-xs mt-0.5 truncate">{job.company}</p>
                          {job.location && (
                            <p className="text-gray-500 text-xs mt-1">📍 {job.location}</p>
                          )}
                          {job.salary && (
                            <p className="text-green-400/70 text-xs mt-0.5">💰 {job.salary}</p>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          {job.url && (
                            <a
                              href={job.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-indigo-400 transition"
                              title="Open link"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                          <button
                            onClick={() => deleteJob(job._id)}
                            className="p-1.5 hover:bg-red-900/30 rounded-lg text-gray-500 hover:text-red-400 transition"
                            title="Delete"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {job.notes && (
                        <p className="text-gray-500 text-xs mt-2 line-clamp-2">{job.notes}</p>
                      )}

                      <div className="mt-3 flex gap-1 flex-wrap">
                        {Object.keys(STATUS_CONFIG)
                          .filter((s) => s !== status)
                          .slice(0, 3)
                          .map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(job._id, s)}
                              className="px-2 py-0.5 text-[10px] rounded bg-gray-800 text-gray-500 hover:text-white hover:bg-gray-700 transition"
                            >
                              → {STATUS_CONFIG[s].label}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-16 text-center">
          <span className="text-6xl block mb-4">💼</span>
          <h3 className="text-xl font-semibold text-white mb-2">No jobs tracked yet</h3>
          <p className="text-gray-500 mb-6">Start tracking your job applications to stay organized</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all"
          >
            + Add Your First Job
          </button>
        </div>
      )}

      {/* Add Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add Job Application</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-white transition p-1"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={addJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Company *</label>
                <input
                  type="text"
                  placeholder="e.g., Google, Microsoft..."
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Position *</label>
                <input
                  type="text"
                  placeholder="e.g., Frontend Developer"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Remote, NYC"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Salary</label>
                  <input
                    type="text"
                    placeholder="e.g., $120k"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Job URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all"
                >
                  {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.emoji} {val.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Notes</label>
                <textarea
                  placeholder="Any additional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-xl font-medium hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all"
                >
                  Add Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}