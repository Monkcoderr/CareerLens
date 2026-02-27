import { useState } from 'react';
import toast from 'react-hot-toast';
import Card from '../ui/Card';
import Button from '../ui/Button';
import API from '../../utils/api';
import { FileEdit, Copy, Sparkles } from 'lucide-react';

export default function CoverLetterGen() {
  const [form, setForm] = useState({ resumeText:'', jobDescription:'', company:'', position:'' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const h = (e) => setForm({...form,[e.target.name]:e.target.value});

  const inputClass = 'w-full h-11 px-4 border border-border rounded-xl text-sm text-txt-primary placeholder-txt-light focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition';

  const generate = async () => {
    if (!form.resumeText||!form.jobDescription||!form.company||!form.position) { toast.error('Fill all fields'); return; }
    setLoading(true);
    try { const{data}=await API.post('/ai/cover-letter',form); setResult(data); toast.success('Cover letter generated!'); } catch { toast.error('Generation failed'); }
    setLoading(false);
  };

  const copy = () => { if(result?.coverLetter){navigator.clipboard.writeText(result.coverLetter);toast.success('Copied!')} };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-txt-primary flex items-center gap-2"><FileEdit size={22} className="text-primary-500" /> AI Cover Letter Generator</h1>
        <p className="text-txt-muted text-sm mt-1">Generate personalized, ATS-optimized cover letters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-txt-secondary mb-1.5">Company *</label><input name="company" value={form.company} onChange={h} placeholder="e.g., Google" className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-txt-secondary mb-1.5">Position *</label><input name="position" value={form.position} onChange={h} placeholder="e.g., SDE-1" className={inputClass} /></div>
          </div>
          <div><label className="block text-sm font-medium text-txt-secondary mb-1.5">Resume / Experience *</label>
            <textarea name="resumeText" value={form.resumeText} onChange={h} rows={6} placeholder="Paste your resume text or key highlights..."
              className="w-full px-4 py-3 border border-border rounded-xl text-sm text-txt-primary placeholder-txt-light focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none" />
          </div>
          <div><label className="block text-sm font-medium text-txt-secondary mb-1.5">Job Description *</label>
            <textarea name="jobDescription" value={form.jobDescription} onChange={h} rows={6} placeholder="Paste the job description..."
              className="w-full px-4 py-3 border border-border rounded-xl text-sm text-txt-primary placeholder-txt-light focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none" />
          </div>
          <Button variant="primary" size="lg" className="w-full" onClick={generate} disabled={loading}>
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Sparkles size={16} /> Generate Cover Letter</>}
          </Button>
        </div>

        {/* Output */}
        <div className="space-y-4">
          {result ? (
            <>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-txt-primary">Generated Cover Letter</h3>
                  <Button variant="secondary" size="sm" onClick={copy}><Copy size={14} /> Copy</Button>
                </div>
                <div className="bg-surface rounded-xl p-5 border border-border-light">
                  <p className="text-sm text-txt-secondary whitespace-pre-line leading-relaxed">{result.coverLetter}</p>
                </div>
              </Card>
              <Card className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-txt-muted">Match Score</span>
                  <span className={`text-lg font-bold ${(result.matchScore||0)>=80?'text-emerald-500':(result.matchScore||0)>=60?'text-amber-500':'text-red-500'}`}>{result.matchScore||0}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2"><div className="h-1.5 rounded-full transition-all duration-1000" style={{width:`${result.matchScore||0}%`,backgroundColor:(result.matchScore||0)>=80?'#10B981':(result.matchScore||0)>=60?'#F59E0B':'#EF4444'}}></div></div>
              </Card>
              {result.highlightedSkills?.length>0 && (
                <Card className="p-5">
                  <p className="text-xs font-medium text-txt-muted mb-2">Matching Skills</p>
                  <div className="flex flex-wrap gap-1.5">{result.highlightedSkills.map((s,i)=><span key={i} className="px-2.5 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-medium">{s}</span>)}</div>
                </Card>
              )}
              {result.tips?.length>0 && (
                <Card className="p-5">
                  <p className="text-xs font-medium text-txt-muted mb-2">💡 Tips</p>
                  <ul className="space-y-1.5">{result.tips.map((t,i)=><li key={i} className="text-sm text-txt-secondary flex items-start gap-1.5"><span className="text-amber-500 mt-0.5">→</span>{t}</li>)}</ul>
                </Card>
              )}
            </>
          ) : (
            <Card className="flex items-center justify-center min-h-[400px]">
              <div className="text-center p-8">
                <span className="text-5xl block mb-3">✉️</span>
                <p className="text-txt-muted text-sm">Your cover letter will appear here</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
