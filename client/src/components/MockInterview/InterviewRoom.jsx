import { useState } from 'react';
import toast from 'react-hot-toast';
import Card from '../ui/Card';
import Button from '../ui/Button';
import API from '../../utils/api';
import { MessageSquare, Send, RotateCcw, CheckCircle2, Play, Sparkles, ChevronRight, AlertCircle, TrendingUp, Lightbulb } from 'lucide-react';

export default function InterviewRoom() {
  const [config, setConfig] = useState({ role: '', type: 'mixed', difficulty: 'medium', questionCount: 5 });
  const [interview, setInterview] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [finalResult, setFinalResult] = useState(null);

  const inputClass = 'w-full h-[52px] px-5 border border-border rounded-xl text-txt-primary placeholder:text-txt-muted bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium';

  const start = async () => {
    if (!config.role.trim()) { toast.error('Please enter a target role'); return; }
    setLoading(true);
    try {
      const { data } = await API.post('/ai/interview/start', config);
      setInterview(data); setCurrentQ(0); setAnswer(''); setFeedback(null); setCompleted(false); setFinalResult(null);
      toast.success('Interview session generated!');
    } catch { toast.error('Failed to generate interview'); }
    setLoading(false);
  };

  const submit = async () => {
    if (!answer.trim()) { toast.error('Please provide an answer'); return; }
    setSubmitting(true);
    try {
      const { data } = await API.post('/ai/interview/answer', { interviewId: interview.interviewId, questionIndex: currentQ, answer: answer.trim() });
      setFeedback(data);
    } catch { toast.error('Evaluation failed'); }
    setSubmitting(false);
  };

  const next = () => {
    if (currentQ < interview.questions.length - 1) { setCurrentQ(currentQ + 1); setAnswer(''); setFeedback(null); }
    else complete();
  };

  const complete = async () => {
    try {
      const { data } = await API.post('/ai/interview/complete', { interviewId: interview.interviewId });
      setFinalResult(data); setCompleted(true); toast.success('Interview complete!');
    } catch { toast.error('Failed to complete session'); }
  };

  const reset = () => { setInterview(null); setCurrentQ(0); setAnswer(''); setFeedback(null); setCompleted(false); setFinalResult(null); };

  const scoreColor = (s) => s >= 80 ? 'text-emerald-500' : s >= 60 ? 'text-primary-500' : 'text-red-500';
  const scoreBg = (s) => s >= 80 ? 'bg-emerald-50 text-emerald-600' : s >= 60 ? 'bg-primary-50 text-primary-600' : 'bg-red-50 text-red-500';

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="h2 text-txt-primary flex items-center gap-3">
            AI Interview Simulator <span className="p-1 px-3 bg-primary-900 text-white rounded-full text-[12px] font-bold uppercase tracking-widest flex items-center gap-1.5"><Sparkles size={12} fill="currentColor" /> Live Prep</span>
          </h1>
          <p className="body-large mt-2">Practice role-specific questions and get instant behavioral feedback.</p>
        </div>
      </div>

      {/* Setup phase */}
      {!interview && !completed && (
        <Card className="p-10 border-0 shadow-soft bg-white">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500"><RotateCcw size={20} /></div>
            <h2 className="text-xl font-bold text-txt-primary">Configure Session</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="text-[13px] font-bold text-txt-primary uppercase tracking-widest mb-3 block">Target Professional Role</label>
              <input value={config.role} onChange={e => setConfig({ ...config, role: e.target.value })} placeholder="e.g. Senior Frontend Engineer" className={inputClass} />
            </div>
            <div>
              <label className="text-[13px] font-bold text-txt-primary uppercase tracking-widest mb-3 block">Interview Focus</label>
              <select value={config.type} onChange={e => setConfig({ ...config, type: e.target.value })} className={inputClass}>
                <option value="mixed">Mixed (Technical & Behavioral)</option>
                <option value="technical">Pure Technical</option>
                <option value="behavioral">Pure Behavioral</option>
                <option value="system-design">Architecture & System Design</option>
              </select>
            </div>
            <div>
              <label className="text-[13px] font-bold text-txt-primary uppercase tracking-widest mb-3 block">Complexity Level</label>
              <select value={config.difficulty} onChange={e => setConfig({ ...config, difficulty: e.target.value })} className={inputClass}>
                <option value="easy">Beginner / Junior</option>
                <option value="medium">Intermediate / Mid</option>
                <option value="hard">Expert / Senior</option>
              </select>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Button variant="primary" size="lg" className="px-12 !h-[56px] shadow-heavy" onClick={start} disabled={loading}>
              {loading ? 'Generating Simulation...' : <><Play size={18} fill="currentColor" className="mr-2" /> Start AI Interview</>}
            </Button>
          </div>
        </Card>
      )}

      {/* active interview room */}
      {interview && !completed && (
        <div className="space-y-8 animate-slide-up">
          {/* Progress header */}
          <div className="flex items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-4">
              <span className="text-[12px] font-bold text-txt-muted uppercase tracking-widest">Question {currentQ + 1} of {interview.questions.length}</span>
              <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 transition-all duration-500" style={{ width: `${((currentQ + (feedback ? 1 : 0)) / interview.questions.length) * 100}%` }}></div>
              </div>
            </div>
            <button onClick={reset} className="text-[12px] font-bold text-red-500 uppercase tracking-widest hover:underline">Terminate Session</button>
          </div>

          <Card className="p-10 lg:p-12 border-0 shadow-heavy overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-primary-900"><MessageSquare size={120} /></div>

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 font-bold text-xl mb-8">
                {currentQ + 1}
              </div>
              <h3 className="text-2xl font-bold text-txt-primary tracking-tight leading-tight mb-10 max-w-2xl">
                {interview.questions[currentQ].question}
              </h3>

              {!feedback ? (
                <div className="space-y-6">
                  <div className="relative">
                    <textarea
                      value={answer}
                      onChange={e => setAnswer(e.target.value)}
                      placeholder="Speak or type your response here..."
                      rows={8}
                      className="w-full p-6 border border-border rounded-2xl text-[16px] text-txt-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none bg-surface-alt/20"
                    />
                    <div className="absolute bottom-4 right-6 text-[11px] font-bold text-txt-muted uppercase tracking-widest">
                      {answer.length} Characters
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="primary" size="lg" className="px-10" onClick={submit} disabled={submitting || !answer.trim()}>
                      {submitting ? 'Evaluating...' : <><Send size={18} className="mr-2" /> Submit Response</>}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-fade-in">
                  <div className={`p-8 rounded-2xl border flex flex-col md:flex-row items-center gap-8 ${scoreBg(feedback.score)}`}>
                    <div className="text-5xl font-bold tracking-tighter shrink-0">{feedback.score || 0}%</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1 uppercase tracking-tight">AI Evaluation</h4>
                      <p className="text-[15px] font-medium leading-relaxed opacity-90">{feedback.feedback}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <h4 className="text-[12px] font-bold text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2"><CheckCircle2 size={16} /> Strong Points</h4>
                      <ul className="space-y-3">
                        {feedback.strengths?.map((s, i) => <li key={i} className="text-[14px] font-semibold text-emerald-800 flex items-start gap-2.5"> <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div> {s}</li>)}
                      </ul>
                    </div>
                    <div className="p-6 bg-primary-50 rounded-2xl border border-primary-100">
                      <h4 className="text-[12px] font-bold text-primary-700 uppercase tracking-widest mb-4 flex items-center gap-2"><Lightbulb size={16} /> Best Practice Example</h4>
                      <p className="text-[14px] font-medium text-primary-800 leading-relaxed italic">"{feedback.idealAnswer}"</p>
                    </div>
                  </div>

                  <div className="flex justify-center pt-6">
                    <Button variant="primary" size="lg" className="px-16 !h-[56px]" onClick={next}>
                      {currentQ < interview.questions.length - 1 ? 'Go to Next Question' : 'View Final Result'} <ChevronRight size={20} className="ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* final overview phase */}
      {completed && finalResult && (
        <div className="space-y-8 animate-slide-up">
          <Card className="p-12 text-center border-0 shadow-heavy overflow-hidden relative">
            <div className="absolute inset-0 hero-gradient opacity-40"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold mb-8 shadow-heavy bg-white ${scoreColor(finalResult.overallScore)}`}>
                {finalResult.overallScore || 0}%
              </div>
              <h2 className="h2 mb-4 tracking-tight">Simulation Complete</h2>
              <p className="body-large text-txt-muted max-w-lg mb-10">{finalResult.feedback}</p>
              <Button variant="primary" size="lg" className="px-12" onClick={reset}><RotateCcw size={18} className="mr-2" /> Practice Again</Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6">
            <h3 className="text-sm font-bold text-txt-primary uppercase tracking-widest px-2">Detailed Question Review</h3>
            {finalResult.questions?.map((q, i) => (
              <Card key={i} className="p-8 border-0 shadow-soft">
                <div className="flex items-start justify-between gap-6 mb-6 pb-6 border-b border-border">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">Question {i + 1}</p>
                    <h4 className="text-lg font-bold text-txt-primary leading-tight">{q.question}</h4>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-xl font-bold shrink-0 ${scoreBg(q.score)}`}>{q.score}%</div>
                </div>
                <div className="space-y-6">
                  <div className="p-5 bg-surface-alt/50 rounded-xl border border-transparent">
                    <p className="text-[11px] font-bold text-txt-muted uppercase tracking-widest mb-3">Your Answer</p>
                    <p className="text-[15px] font-medium text-txt-primary leading-relaxed">{q.userAnswer}</p>
                  </div>
                  <div className="p-5 bg-primary-50/50 rounded-xl border border-transparent">
                    <p className="text-[11px] font-bold text-primary-600 uppercase tracking-widest mb-3">AI Coach Insight</p>
                    <p className="text-[15px] font-medium text-primary-800 leading-relaxed">{q.aiFeedback}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
