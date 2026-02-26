import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import toast from 'react-hot-toast';
import Card from '../ui/Card';
import Button from '../ui/Button';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Upload, CheckCircle2, AlertTriangle, Search } from 'lucide-react';

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
      toast.success('Resume analyzed!');
    } catch (err) { toast.error(err.response?.data?.error || 'Analysis failed'); }
    setLoading(false);
  }, [targetRole, updateUser]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, maxSize: 5*1024*1024, disabled: loading,
  });

  const scoreColor = (s) => s >= 80 ? '#10B981' : s >= 60 ? '#F59E0B' : '#EF4444';
  const scoreBg = (s) => s >= 80 ? 'bg-emerald-50 text-emerald-600' : s >= 60 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-txt-primary flex items-center gap-2">
          <Search size={22} className="text-primary-500" /> AI Resume Analyzer
        </h1>
        <p className="text-txt-muted text-sm mt-1">Upload your resume for instant AI-powered ATS analysis</p>
      </div>

      <Card className="p-6">
        <label className="block text-sm font-medium text-txt-secondary mb-1.5">Target Role</label>
        <input type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)}
          placeholder="e.g., Full Stack Developer, Product Manager..."
          className="w-full h-11 px-4 border border-border rounded-xl text-sm text-txt-primary placeholder-txt-light focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" />
      </Card>

      <div {...getRootProps()} className={`border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all ${loading ? 'border-primary-300 bg-primary-50/30 cursor-wait' : isDragActive ? 'border-primary-500 bg-primary-50/50 scale-[1.01]' : 'border-slate-300 hover:border-primary-400 bg-white'}`}>
        <input {...getInputProps()} />
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-[3px] border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-primary-600 font-medium">Analyzing with AI...</p>
            <p className="text-txt-light text-sm">This may take 15-30 seconds</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center"><Upload size={24} className="text-primary-500" /></div>
            <p className="text-txt-primary font-medium">{isDragActive ? 'Drop your resume' : 'Drag & drop your resume'}</p>
            <p className="text-txt-light text-sm">or click to browse · PDF only · Max 5 MB</p>
          </div>
        )}
      </div>

      {analysis && (
        <div className="space-y-6 animate-slide-up">
          {/* Score */}
          <Card className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 flex-shrink-0">
                <CircularProgressbar value={analysis.overallScore||0} text={`${analysis.overallScore||0}%`}
                  styles={buildStyles({ textColor:'#0F172A', textSize:'22px', pathColor:scoreColor(analysis.overallScore||0), trailColor:'#E2E8F0', pathTransitionDuration:1.5 })} />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-xl font-bold text-txt-primary">Overall Resume Score</h2>
                <div className="flex items-center gap-3 mt-2 justify-center md:justify-start">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${scoreBg(analysis.atsCompatibility||0)}`}>ATS: {analysis.atsCompatibility||0}%</span>
                </div>
                <p className="text-sm text-txt-muted mt-3 max-w-md">
                  {(analysis.overallScore||0) >= 80 ? '🎉 Excellent! Your resume is well-optimized.' : (analysis.overallScore||0) >= 60 ? '⚡ Good start! Some improvements can boost your score.' : '🔧 Follow the suggestions below to improve.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Section Scores */}
          {analysis.sections && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(analysis.sections).map(([key, sec]) => (
                <Card key={key} className="p-5">
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-sm font-semibold text-txt-primary capitalize">{key}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${scoreBg(sec.score||0)}`}>{sec.score||0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2.5"><div className="h-1.5 rounded-full transition-all duration-1000" style={{ width:`${sec.score||0}%`, backgroundColor:scoreColor(sec.score||0) }}></div></div>
                  <p className="text-xs text-txt-muted leading-relaxed">{sec.feedback || 'No feedback'}</p>
                </Card>
              ))}
            </div>
          )}

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.strengths?.length > 0 && (
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-emerald-600 flex items-center gap-2 mb-3"><CheckCircle2 size={16} /> Strengths</h3>
                <ul className="space-y-2">{analysis.strengths.map((s,i) => <li key={i} className="flex items-start gap-2 text-sm text-txt-secondary"><span className="text-emerald-500 mt-0.5">✓</span>{s}</li>)}</ul>
              </Card>
            )}
            {analysis.improvements?.length > 0 && (
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-amber-600 flex items-center gap-2 mb-3"><AlertTriangle size={16} /> Improvements</h3>
                <ul className="space-y-2">{analysis.improvements.map((s,i) => <li key={i} className="flex items-start gap-2 text-sm text-txt-secondary"><span className="text-amber-500 mt-0.5">→</span>{s}</li>)}</ul>
              </Card>
            )}
          </div>

          {/* Keywords */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-txt-primary mb-4">🔑 Keyword Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-txt-muted mb-2">Found ✅</p>
                <div className="flex flex-wrap gap-1.5">{(analysis.keywords||[]).map((k,i) => <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">{k}</span>)}</div>
              </div>
              <div>
                <p className="text-xs font-medium text-txt-muted mb-2">Missing ❌</p>
                <div className="flex flex-wrap gap-1.5">{(analysis.missingKeywords||[]).map((k,i) => <span key={i} className="px-2.5 py-1 bg-red-50 text-red-500 rounded-full text-xs font-medium">{k}</span>)}</div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}