import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import toast from 'react-hot-toast';
import Card from '../ui/Card';
import Button from '../ui/Button';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Upload, CheckCircle2, AlertTriangle, Search, FileText, Sparkles, XCircle } from 'lucide-react';

export default function ResumeUpload() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const { updateUser } = useAuth();

  const onDrop = useCallback(async (files) => {
    const file = files[0];
    if (!file) return;
    setLoading(true); setAnalysis(null);
    const fd = new FormData();
    fd.append('resume', file); fd.append('targetRole', targetRole);
    try {
      const { data } = await API.post('/resume/analyze', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120000 });
      setAnalysis(data.analysis);
      updateUser({ resumeScore: data.analysis.overallScore });
      toast.success('Resume analyzed successfully!');
    } catch (err) { toast.error(err.response?.data?.error || 'Analysis failed'); }
    setLoading(false);
  }, [targetRole, updateUser]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, maxSize: 5 * 1024 * 1024, disabled: loading,
  });

  const scoreColor = (s) => s >= 80 ? '#10B981' : s >= 60 ? '#2563EB' : '#EF4444';
  const scoreBgColor = (s) => s >= 80 ? 'bg-emerald-50 text-emerald-600' : s >= 60 ? 'bg-primary-50 text-primary-600' : 'bg-red-50 text-red-500';

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="h2 text-txt-primary flex items-center gap-3">
            Resume Intelligence <span className="p-1 px-3 bg-primary-900 text-white rounded-full text-[12px] font-bold uppercase tracking-widest flex items-center gap-1.5"><Sparkles size={12} fill="currentColor" /> AI Powered</span>
          </h1>
          <p className="body-large mt-2">Upload your resume to see how you rank against ATS algorithms.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-8 border-0 shadow-soft bg-white">
            <label className="text-[13px] font-bold text-txt-primary uppercase tracking-widest mb-4 block">Target Job Title</label>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-muted" />
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Product Manager"
                className="w-full h-[52px] pl-12 pr-5 border border-border rounded-xl text-txt-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>
            <p className="text-[11px] text-txt-muted mt-4 font-medium italic">Keywords will be tailored to this specific role for better accuracy.</p>
          </Card>

          <div {...getRootProps()} className={`relative group h-[260px] rounded-[20px] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer ${loading ? 'border-primary-300 bg-primary-50/20' : isDragActive ? 'border-primary-500 bg-primary-50/50' : 'border-slate-300 hover:border-primary-500 hover:bg-white shadow-soft group-hover:shadow-heavy'}`}>
            <input {...getInputProps()} />
            {loading ? (
              <div className="space-y-4">
                <div className="w-12 h-12 border-[4px] border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="font-bold text-primary-900 tracking-tight">AI is analyzing...</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                  <Upload size={28} />
                </div>
                <p className="text-txt-primary font-bold">{isDragActive ? 'Drop files here' : 'Drop your Resume'}</p>
                <p className="text-[12px] text-txt-muted font-semibold mt-1 uppercase tracking-wider">PDF only • Max 5MB</p>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {analysis ? (
            <div className="space-y-8 animate-slide-up">
              <Card className="p-8 border-0 shadow-soft bg-white">
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="w-40 h-40 flex-shrink-0 relative">
                    <CircularProgressbar
                      value={analysis.overallScore || 0}
                      text={`${analysis.overallScore || 0}%`}
                      styles={buildStyles({
                        textColor: '#0F172A',
                        textSize: '24px',
                        pathColor: scoreColor(analysis.overallScore || 0),
                        trailColor: '#F1F5F9',
                        pathTransitionDuration: 2
                      })}
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-txt-primary mb-3">Matching Score</h2>
                    <p className="text-txt-muted text-[15px] leading-relaxed mb-6">
                      Your resume has been analyzed across 4 core dimensions including Formatting, Impact, and Keyword Density.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                      <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-widest ${scoreBgColor(analysis.overallScore)}`}>
                        Score: {analysis.overallScore >= 80 ? 'Excellent' : analysis.overallScore >= 60 ? 'Good' : 'Needs Work'}
                      </span>
                      <span className="px-4 py-1.5 bg-slate-100 text-txt-primary rounded-full text-[12px] font-bold uppercase tracking-widest">
                        ATS Ready: Yes
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8 border-0 shadow-soft bg-white">
                  <h3 className="text-[13px] font-bold text-emerald-600 uppercase tracking-widest mb-6 flex items-center gap-2"><CheckCircle2 size={16} /> Key Strengths</h3>
                  <ul className="space-y-4">
                    {analysis.strengths?.map((s, i) => (
                      <li key={i} className="flex gap-3 text-sm font-semibold text-txt-primary leading-tight">
                        <span className="text-emerald-500 font-bold shrink-0">✓</span> {s}
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card className="p-8 border-0 shadow-soft bg-white">
                  <h3 className="text-[13px] font-bold text-amber-600 uppercase tracking-widest mb-6 flex items-center gap-2"><AlertTriangle size={16} /> Areas for Growth</h3>
                  <ul className="space-y-4">
                    {analysis.improvements?.map((s, i) => (
                      <li key={i} className="flex gap-3 text-sm font-semibold text-txt-primary leading-tight">
                        <span className="text-amber-500 font-bold shrink-0">→</span> {s}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              <Card className="p-8 border-0 shadow-soft bg-white">
                <h3 className="text-[13px] font-bold text-txt-primary uppercase tracking-widest mb-8 flex items-center gap-2">🔍 Strategic Keyword Matches</h3>
                <div className="space-y-8">
                  <div>
                    <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-4">Found in your Resume</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords?.map((k, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-xs font-bold">{k}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-red-500 uppercase tracking-widest mb-4">Missing from your Resume</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingKeywords?.map((k, i) => (
                        <span key={i} className="px-3 py-1 bg-red-50 text-red-500 border border-red-100 rounded-lg text-xs font-bold">{k}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="h-[500px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[20px] shadow-soft border border-border">
              <div className="w-20 h-20 rounded-full bg-surface-alt flex items-center justify-center mb-6">
                <FileText size={40} className="text-txt-muted" />
              </div>
              <h3 className="h3 mb-3">No analysis data yet</h3>
              <p className="body-large text-txt-muted max-w-sm">Upload your resume on the left to start the AI analysis process.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}