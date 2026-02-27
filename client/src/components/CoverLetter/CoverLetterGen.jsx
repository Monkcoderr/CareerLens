import { useState } from 'react';
import toast from 'react-hot-toast';
import Card from '../ui/Card';
import Button from '../ui/Button';
import API from '../../utils/api';
import { FileEdit, Copy, Sparkles, Building2, Briefcase, FileText, CheckCircle2, Lightbulb } from 'lucide-react';

export default function CoverLetterGen() {
  const [form, setForm] = useState({ resumeText: '', jobDescription: '', company: '', position: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const h = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const inputClass = 'w-full h-[52px] px-5 border border-border rounded-xl text-txt-primary placeholder:text-txt-muted bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium';
  const areaClass = 'w-full px-5 py-4 border border-border rounded-xl text-[15px] text-txt-primary placeholder:text-txt-muted bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium resize-none';

  const generate = async () => {
    if (!form.resumeText || !form.jobDescription || !form.company || !form.position) {
      toast.error('Please complete all fields to tailor your letter.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/ai/cover-letter', form);
      setResult(data);
      toast.success('Professional cover letter tailored!');
    } catch {
      toast.error('AI generation encountered an error.');
    }
    setLoading(false);
  };

  const copy = () => { if (result?.coverLetter) { navigator.clipboard.writeText(result.coverLetter); toast.success('Copied to clipboard!') } };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="h2 text-txt-primary flex items-center gap-3">
            AI Cover Letter Personalizer <span className="p-1 px-3 bg-primary-900 text-white rounded-full text-[12px] font-bold uppercase tracking-widest flex items-center gap-1.5"><Sparkles size={12} fill="currentColor" /> Premium Tailoring</span>
          </h1>
          <p className="body-large mt-2">Generate high-conversion cover letters tailored to specific job descriptions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Controls */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 border-0 shadow-soft bg-white">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-[12px] font-bold text-txt-primary uppercase tracking-widest mb-3 block flex items-center gap-2"><Building2 size={14} /> Target Company</label>
                <input name="company" value={form.company} onChange={h} placeholder="e.g. OpenAI" className={inputClass} />
              </div>
              <div>
                <label className="text-[12px] font-bold text-txt-primary uppercase tracking-widest mb-3 block flex items-center gap-2"><Briefcase size={14} /> Target Position</label>
                <input name="position" value={form.position} onChange={h} placeholder="e.g. Sr. Product Designer" className={inputClass} />
              </div>
              <div>
                <label className="text-[12px] font-bold text-txt-primary uppercase tracking-widest mb-3 block flex items-center gap-2"><FileText size={14} /> Resume Background</label>
                <textarea name="resumeText" value={form.resumeText} onChange={h} rows={5} placeholder="Paste key achievements or full resume text..." className={areaClass} />
              </div>
              <div>
                <label className="text-[12px] font-bold text-txt-primary uppercase tracking-widest mb-3 block flex items-center gap-2"><Sparkles size={14} /> Job Description</label>
                <textarea name="jobDescription" value={form.jobDescription} onChange={h} rows={5} placeholder="Paste the job requirements to match skills..." className={areaClass} />
              </div>
              <div className="pt-4">
                <Button variant="primary" size="lg" className="w-full !h-[56px] shadow-heavy" onClick={generate} disabled={loading}>
                  {loading ? 'Generating Simulation...' : <><Sparkles size={18} fill="currentColor" className="mr-2" /> Personalize Letter</>}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Output Area */}
        <div className="lg:col-span-3">
          {result ? (
            <div className="space-y-6 animate-slide-up">
              <Card className="p-10 border-0 shadow-soft bg-white min-h-[600px] flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><FileText size={200} /></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 font-bold text-xl">{result.matchScore || 0}%</div>
                      <div>
                        <p className="text-[12px] font-bold text-txt-muted uppercase tracking-widest">Similarity Score</p>
                        <p className="text-sm font-bold text-txt-primary">Excellent alignment with JD</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="md" className="!rounded-xl" onClick={copy}><Copy size={16} className="mr-2" /> Copy to Clipboard</Button>
                  </div>

                  <div className="flex-1 bg-surface-alt/20 rounded-2xl p-8 border border-transparent hover:border-border transition-all">
                    <p className="text-[15px] font-medium text-txt-primary leading-relaxed whitespace-pre-line font-serif italic text-slate-700">
                      {result.coverLetter}
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100/50">
                      <h4 className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest mb-2 flex items-center gap-1.5"><CheckCircle2 size={12} /> Key Skills Infused</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {result.highlightedSkills?.map((s, i) => <span key={i} className="px-2 py-0.5 bg-white text-emerald-600 rounded-md text-[10px] font-bold border border-emerald-200">{s}</span>)}
                      </div>
                    </div>
                    <div className="p-4 bg-primary-50 rounded-xl border border-primary-100/50">
                      <h4 className="text-[11px] font-bold text-primary-700 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Lightbulb size={12} /> Career Tip</h4>
                      <p className="text-[11px] font-semibold text-primary-800 leading-tight">{result.tips?.[0] || 'Mention specific metrics for higher impact.'}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="h-[730px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[20px] shadow-soft border border-border border-dashed border-2">
              <div className="w-20 h-20 rounded-full bg-surface-alt flex items-center justify-center mb-6">
                <FileEdit size={40} className="text-txt-muted" />
              </div>
              <h3 className="h3 mb-3 text-txt-muted">Draft Placeholder</h3>
              <p className="body-large text-txt-muted/60 max-w-sm">Fill in the job details on the left to generate your perfectly tailored cover letter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
