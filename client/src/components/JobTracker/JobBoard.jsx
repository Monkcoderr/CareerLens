import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Card from '../ui/Card';
import Button from '../ui/Button';
import API from '../../utils/api';
import { Briefcase, Plus, X, Trash2, ExternalLink } from 'lucide-react';

const S = {
  saved: { label: 'Saved', bg: 'bg-slate-100 text-slate-600' },
  applied: { label: 'Applied', bg: 'bg-blue-50 text-blue-600' },
  interviewing: { label: 'Interviewing', bg: 'bg-purple-50 text-purple-600' },
  offered: { label: 'Offered', bg: 'bg-emerald-50 text-emerald-600' },
  rejected: { label: 'Rejected', bg: 'bg-red-50 text-red-500' },
  accepted: { label: 'Accepted', bg: 'bg-green-50 text-green-600' },
};

const COLS = ['saved', 'applied', 'interviewing', 'offered'];
const EMPTY_FORM = {
  company: '',
  position: '',
  location: '',
  salary: '',
  url: '',
  status: 'saved',
  notes: '',
};

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);

  const inputClass =
    'w-full h-11 px-4 border border-border rounded-xl text-sm text-txt-primary placeholder-txt-light focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition';

  const fetchJobs = async () => {
    try {
      const { data } = await API.get('/jobs');
      setJobs(data);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchJobs();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!form.company || !form.position) {
      toast.error('Company & position required');
      return;
    }

    try {
      await API.post('/jobs', form);
      toast.success('Job added!');
      setShow(false);
      setForm(EMPTY_FORM);
      void fetchJobs();
    } catch {
      toast.error('Failed');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/jobs/${id}`, { status });
      void fetchJobs();
      toast.success(`-> ${S[status].label}`);
    } catch {
      toast.error('Failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Remove?')) return;

    try {
      await API.delete(`/jobs/${id}`);
      void fetchJobs();
      toast.success('Removed');
    } catch {
      toast.error('Failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="w-8 h-8 border-[3px] border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary flex items-center gap-2">
            <Briefcase size={22} className="text-primary-500" /> Job Tracker
          </h1>
          <p className="text-txt-muted text-sm mt-1">Track and manage your job applications</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShow(true)}>
          <Plus size={16} /> Add Job
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(S).map(([k, v]) => {
          const c = jobs.filter((j) => j.status === k).length;
          return c > 0 ? (
            <span key={k} className={`px-2.5 py-1 rounded-full text-xs font-medium ${v.bg}`}>
              {v.label}: {c}
            </span>
          ) : null;
        })}
        {jobs.length > 0 && (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-600">
            Total: {jobs.length}
          </span>
        )}
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {COLS.map((col) => (
            <div key={col} className="space-y-3">
              <div className="flex items-center justify-between px-0.5">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${S[col].bg}`}>
                  {S[col].label}
                </span>
                <span className="text-xs text-txt-light">{jobs.filter((j) => j.status === col).length}</span>
              </div>
              <div className="space-y-2.5 min-h-[100px]">
                {jobs
                  .filter((j) => j.status === col)
                  .map((j) => (
                    <Card key={j._id} className="p-4 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-txt-primary truncate">{j.position}</p>
                          <p className="text-xs text-txt-muted truncate">{j.company}</p>
                          {j.location && <p className="text-xs text-txt-light mt-1">Location: {j.location}</p>}
                          {j.salary && <p className="text-xs text-emerald-500 mt-0.5">Salary: {j.salary}</p>}
                        </div>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition ml-2">
                          {j.url && (
                            <a
                              href={j.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg hover:bg-primary-50 text-txt-light hover:text-primary-500 transition"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                          <button
                            onClick={() => remove(j._id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-txt-light hover:text-red-500 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2.5 flex gap-1 flex-wrap">
                        {Object.keys(S)
                          .filter((s) => s !== col)
                          .slice(0, 3)
                          .map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(j._id, s)}
                              className="px-2 py-0.5 text-[10px] rounded-md bg-surface border border-border text-txt-light hover:text-txt-primary hover:border-primary-200 transition"
                            >
                              -&gt; {S[s].label}
                            </button>
                          ))}
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-16 text-center">
          <span className="text-5xl block mb-3">No Jobs</span>
          <h3 className="text-lg font-semibold text-txt-primary mb-1">No jobs tracked yet</h3>
          <p className="text-sm text-txt-muted mb-5">Start tracking applications to stay organized</p>
          <Button variant="primary" size="md" onClick={() => setShow(true)}>
            <Plus size={16} /> Add Your First Job
          </Button>
        </Card>
      )}

      {show && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-elevated border border-border p-8 w-full max-w-lg animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-txt-primary">Add Job Application</h2>
              <button onClick={() => setShow(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-txt-light">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={add} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-1.5">Company *</label>
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="e.g., Google"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-1.5">Position *</label>
                <input
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  placeholder="e.g., Frontend Dev"
                  className={inputClass}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1.5">Location</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Remote, NYC"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1.5">Salary</label>
                  <input
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                    placeholder="$120k"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-1.5">Job URL</label>
                <input
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className={inputClass}
                >
                  {Object.entries(S).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-1.5">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  placeholder="Any notes..."
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-txt-primary placeholder-txt-light focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={() => setShow(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="lg" className="flex-1">
                  Add Application
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
