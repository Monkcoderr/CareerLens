import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Card from '../ui/Card';
import Button from '../ui/Button';
import API from '../../utils/api';
import { Briefcase, Plus, X, Trash2, ExternalLink, MapPin, DollarSign, Calendar, ChevronRight } from 'lucide-react';

const S = {
  saved: { label: 'Explore', bg: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
  applied: { label: 'Applied', bg: 'bg-primary-50 text-primary-600', dot: 'bg-primary-500' },
  interviewing: { label: 'Interviews', bg: 'bg-purple-50 text-purple-600', dot: 'bg-purple-500' },
  offered: { label: 'Offered', bg: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' },
  rejected: { label: 'Archived', bg: 'bg-red-50 text-red-500', dot: 'bg-red-400' },
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

  const inputClass = 'w-full h-[52px] px-5 border border-border rounded-xl text-txt-primary placeholder:text-txt-muted bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium';
  const areaClass = 'w-full px-5 py-4 border border-border rounded-xl text-[15px] text-txt-primary placeholder:text-txt-muted bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium resize-none';

  const fetchJobs = async () => {
    try {
      const { data } = await API.get('/jobs');
      setJobs(data);
    } catch {
      toast.error('Failed to sync board');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!form.company || !form.position) { toast.error('Required fields missing'); return; }
    try {
      await API.post('/jobs', form);
      toast.success('Opportunity added to board!');
      setShow(false); setForm(EMPTY_FORM); fetchJobs();
    } catch { toast.error('Error adding job'); }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/jobs/${id}`, { status });
      fetchJobs();
      toast.success(`Moved to ${S[status].label}`);
    } catch { toast.error('Move failed'); }
  };

  const remove = async (id) => {
    if (!confirm('Archive this application?')) return;
    try {
      await API.delete(`/jobs/${id}`);
      fetchJobs();
      toast.success('Opportunity removed');
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-[3px] border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div>
          <h1 className="h2 text-txt-primary flex items-center gap-3">
            Smart Job Tracker <span className="p-1 px-3 bg-primary-100 text-primary-700 rounded-full text-[12px] font-bold uppercase tracking-widest">{jobs.length} Active</span>
          </h1>
          <p className="body-large mt-2">Manage your career pipeline with precision and visual clarity.</p>
        </div>
        <Button variant="primary" size="lg" className="shadow-heavy !h-[52px] px-8" onClick={() => setShow(true)}>
          <Plus size={20} className="mr-2" /> Add Opportunity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {COLS.map((col) => (
          <div key={col} className="space-y-6">
            <div className="flex items-center justify-between px-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${S[col].dot}`}></div>
                <h3 className="text-[14px] font-bold text-txt-primary uppercase tracking-widest">{S[col].label}</h3>
              </div>
              <span className="px-2.5 py-0.5 bg-white border border-border rounded-full text-[12px] font-bold text-txt-muted shadow-soft">
                {jobs.filter((j) => j.status === col).length}
              </span>
            </div>

            <div className="space-y-4 min-h-[500px] p-2 bg-surface-alt/40 rounded-[24px] border border-border/50">
              {jobs.filter((j) => j.status === col).map((j) => (
                <Card key={j._id} className="p-6 border-0 shadow-soft hover:shadow-heavy transition-all group cursor-default">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="min-w-0">
                      <h4 className="text-[16px] font-bold text-txt-primary truncate leading-tight mb-1">{j.position}</h4>
                      <p className="text-[13px] font-semibold text-primary-500 truncate">{j.company}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition duration-300">
                      {j.url && (
                        <a href={j.url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center text-txt-muted hover:text-primary-500 hover:bg-primary-50 transition-all">
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <button onClick={() => remove(j._id)} className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center text-txt-muted hover:text-red-500 hover:bg-red-50 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {j.location && (
                      <div className="flex items-center gap-2 text-[12px] font-semibold text-txt-muted">
                        <MapPin size={12} /> {j.location}
                      </div>
                    )}
                    {j.salary && (
                      <div className="flex items-center gap-2 text-[12px] font-bold text-emerald-600">
                        <DollarSign size={12} /> {j.salary}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {Object.keys(S).filter(s => s !== col && s !== 'rejected').map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(j._id, s)}
                        className="shrink-0 px-3 py-1.5 bg-surface-alt hover:bg-primary-500 hover:text-white rounded-lg text-[10px] font-bold text-txt-muted transition-all uppercase tracking-wider"
                      >
                        To {S[s].label}
                      </button>
                    ))}
                  </div>
                </Card>
              ))}

              {jobs.filter((j) => j.status === col).length === 0 && (
                <div className="h-32 flex items-center justify-center">
                  <p className="text-[12px] font-bold text-txt-muted/40 uppercase tracking-widest">Empty</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Job Modal */}
      {show && (
        <div className="fixed inset-0 bg-primary-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <Card className="bg-white border-0 shadow-heavy w-full max-w-xl animate-scale-in overflow-hidden">
            <div className="p-8 border-b border-border flex items-center justify-between bg-surface-alt/20">
              <h2 className="text-xl font-bold text-txt-primary flex items-center gap-2">
                <Briefcase size={20} className="text-primary-500" /> Track New Opportunity
              </h2>
              <button onClick={() => setShow(false)} className="w-10 h-10 rounded-full hover:bg-white text-txt-muted flex items-center justify-center transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={add} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-bold text-txt-primary uppercase tracking-widest mb-2 block">Company *</label>
                  <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. Stripe" className={inputClass} required />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-txt-primary uppercase tracking-widest mb-2 block">Position *</label>
                  <input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="e.g. Lead Engineer" className={inputClass} required />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-txt-primary uppercase tracking-widest mb-2 block">Location</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Remote / SF" className={inputClass} />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-txt-primary uppercase tracking-widest mb-2 block">Salary Range</label>
                  <input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="$140k - $180k" className={inputClass} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-txt-primary uppercase tracking-widest mb-2 block">Application / Job URL</label>
                  <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://linkedin.com/jobs/..." className={inputClass} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-txt-primary uppercase tracking-widest mb-2 block">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                    {Object.entries(S).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={() => setShow(false)}>Dismiss</Button>
                <Button type="submit" variant="primary" size="lg" className="flex-1 shadow-heavy">Add to Tracker</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
