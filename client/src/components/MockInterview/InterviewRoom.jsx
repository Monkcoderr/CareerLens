import { useState } from 'react';
import toast from 'react-hot-toast';
import Card from '../ui/Card';
import Button from '../ui/Button';
import API from '../../utils/api';
import { MessageSquare, Send, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function InterviewRoom() {
  const [config, setConfig] = useState({ role:'', type:'mixed', difficulty:'medium', questionCount:5 });
  const [interview, setInterview] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [finalResult, setFinalResult] = useState(null);

  const inputClass = 'w-full h-11 px-4 border border-border rounded-xl text-sm text-txt-primary placeholder-txt-light focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition';

  const start = async () => {
    if (!config.role.trim()) { toast.error('Enter a target role'); return; }
    setLoading(true);
    try {
      const { data } = await API.post('/ai/interview/start', config);
      setInterview(data); setCurrentQ(0); setAnswer(''); setFeedback(null); setCompleted(false); setFinalResult(null);
      toast.success('Interview started!');
    } catch (e) { toast.error('Failed to generate questions'); }
    setLoading(false);
  };

  const submit = async () => {
    if (!answer.trim()) { toast.error('Write your answer'); return; }
    setSubmitting(true);
    try {
      const { data } = await API.post('/ai/interview/answer', { interviewId:interview.interviewId, questionIndex:currentQ, answer:answer.trim() });
      setFeedback(data);
    } catch (e) { toast.error('Evaluation failed'); }
    setSubmitting(false);
  };

  const next = () => {
    if (currentQ < interview.questions.length - 1) { setCurrentQ(currentQ+1); setAnswer(''); setFeedback(null); }
    else complete();
  };

  const complete = async () => {
    try {
      const { data } = await API.post('/ai/interview/complete', { interviewId:interview.interviewId });
      setFinalResult(data); setCompleted(true); toast.success('Interview completed!');
    } catch (e) { toast.error('Failed to complete'); }
  };

  const reset = () => { setInterview(null); setCurrentQ(0); setAnswer(''); setFeedback(null); setCompleted(false); setFinalResult(null); };

  const scoreBg = (s) => s>=80?'bg-emerald-50 text-emerald-600':s>=60?'bg-amber-50 text-amber-600':'bg-red-50 text-red-500';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-txt-primary flex items-center gap-2"><MessageSquare size={22} className="text-primary-500" /> AI Mock Interview</h1>
        <p className="text-txt-muted text-sm mt-1">Practice with AI-generated questions and get detailed feedback</p>
      </div>

      {/* Config */}
      {!interview && !completed && (
        <Card className="p-6 lg:p-8">
          <h2 className="text-lg font-semibold text-txt-primary mb-5">Configure Interview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="block text-sm font-medium text-txt-secondary mb-1.5">Target Role *</label><input value={config.role} onChange={e=>setConfig({...config,role:e.target.value})} placeholder="e.g., React Developer" className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-txt-secondary mb-1.5">Type</label><select value={config.type} onChange={e=>setConfig({...config,type:e.target.value})} className={inputClass}><option value="mixed">Mixed</option><option value="technical">Technical</option><option value="behavioral">Behavioral</option><option value="system-design">System Design</option></select></div>
            <div><label className="block text-sm font-medium text-txt-secondary mb-1.5">Difficulty</label><select value={config.difficulty} onChange={e=>setConfig({...config,difficulty:e.target.value})} className={inputClass}><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
            <div><label className="block text-sm font-medium text-txt-secondary mb-1.5">Questions</label><select value={config.questionCount} onChange={e=>setConfig({...config,questionCount:+e.target.value})} className={inputClass}><option value={3}>3</option><option value={5}>5</option><option value={8}>8</option><option value={10}>10</option></select></div>
          </div>
          <Button variant="primary" size="lg" className="mt-6" onClick={start} disabled={loading}>
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Start Interview</>}
          </Button>
        </Card>
      )}

      {/* In Progress */}
      {interview && !completed && (
        <div className="space-y-5 animate-slide-up">
          {/* Progress */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-txt-muted">Question {currentQ+1} / {interview.questions.length}</span>
              <span className="text-xs font-medium text-primary-500">{Math.round(((currentQ+(feedback?1:0))/interview.questions.length)*100)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2"><div className="h-2 rounded-full bg-primary-500 transition-all duration-500" style={{width:`${((currentQ+(feedback?1:0))/interview.questions.length)*100}%`}}></div></div>
          </Card>

          {/* Question */}
          <Card className="p-6 lg:p-8">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 text-sm font-bold flex-shrink-0">{currentQ+1}</div>
              <h3 className="text-base font-medium text-txt-primary leading-relaxed">{interview.questions[currentQ].question}</h3>
            </div>

            {!feedback && (
              <div>
                <textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Type your answer..." rows={7}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-txt-primary placeholder-txt-light focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none" />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-txt-light">{answer.length} chars</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={reset}>Exit</Button>
                    <Button variant="primary" size="md" onClick={submit} disabled={submitting||!answer.trim()}>
                      {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Send size={14} /> Submit</>}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {feedback && (
              <div className="space-y-4 animate-slide-up">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border">
                  <span className={`text-3xl font-bold ${(feedback.score||0)>=80?'text-emerald-500':(feedback.score||0)>=60?'text-amber-500':'text-red-500'}`}>{feedback.score||0}%</span>
                  <p className="text-sm text-txt-secondary">{feedback.feedback}</p>
                </div>
                {feedback.strengths?.length>0 && (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <h4 className="text-xs font-semibold text-emerald-700 mb-2">✅ Strengths</h4>
                    <ul className="space-y-1">{feedback.strengths.map((s,i)=><li key={i} className="text-sm text-emerald-700 flex items-start gap-1.5"><CheckCircle2 size={14} className="mt-0.5 flex-shrink-0"/>{s}</li>)}</ul>
                  </div>
                )}
                {feedback.idealAnswer && (
                  <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                    <h4 className="text-xs font-semibold text-primary-700 mb-2">💡 Ideal Answer</h4>
                    <p className="text-sm text-primary-800">{feedback.idealAnswer}</p>
                  </div>
                )}
                <Button variant="primary" size="lg" className="w-full" onClick={next}>
                  {currentQ < interview.questions.length-1 ? 'Next Question →' : 'Complete Interview ✓'}
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Completed */}
      {completed && finalResult && (
        <div className="space-y-6 animate-slide-up">
          <Card className="p-8 text-center">
            <span className="text-5xl block mb-3">{(finalResult.overallScore||0)>=80?'🏆':(finalResult.overallScore||0)>=60?'👍':'💪'}</span>
            <p className={`text-5xl font-bold mb-3 ${(finalResult.overallScore||0)>=80?'text-emerald-500':(finalResult.overallScore||0)>=60?'text-amber-500':'text-red-500'}`}>{finalResult.overallScore||0}%</p>
            <h2 className="text-xl font-bold text-txt-primary">Interview Complete!</h2>
            <p className="text-sm text-txt-muted mt-2 max-w-md mx-auto">{finalResult.feedback}</p>
            <Button variant="primary" size="lg" className="mt-6" onClick={reset}><RotateCcw size={16} /> New Interview</Button>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-txt-primary mb-4">Question Review</h3>
            <div className="space-y-3">
              {(finalResult.questions||[]).map((q,i) => (
                <div key={i} className="p-4 bg-surface rounded-xl border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-txt-primary flex-1 pr-3"><span className="text-primary-500">Q{i+1}:</span> {q.question}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg flex-shrink-0 ${scoreBg(q.score||0)}`}>{q.score||0}%</span>
                  </div>
                  {q.userAnswer && <p className="text-xs text-txt-muted mb-1"><strong>You:</strong> {q.userAnswer}</p>}
                  {q.aiFeedback && <p className="text-xs text-primary-600"><strong>AI:</strong> {q.aiFeedback}</p>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}