import { useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../utils/api';

export default function InterviewRoom() {
  const [config, setConfig] = useState({
    role: '',
    type: 'mixed',
    difficulty: 'medium',
    questionCount: 5
  });
  const [interview, setInterview] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [finalResult, setFinalResult] = useState(null);

  const startInterview = async () => {
    if (!config.role.trim()) {
      toast.error('Please enter a target role');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/ai/interview/start', config);
      setInterview(data);
      setCurrentQ(0);
      setAnswer('');
      setFeedback(null);
      setCompleted(false);
      setFinalResult(null);
      toast.success('Interview started! Good luck 🍀');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate questions');
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      toast.error('Please write your answer');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await API.post('/ai/interview/answer', {
        interviewId: interview.interviewId,
        questionIndex: currentQ,
        answer: answer.trim()
      });
      setFeedback(data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to evaluate answer');
    }
    setSubmitting(false);
  };

  const nextQuestion = () => {
    if (currentQ < interview.questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setAnswer('');
      setFeedback(null);
    } else {
      completeInterview();
    }
  };

  const completeInterview = async () => {
    try {
      const { data } = await API.post('/ai/interview/complete', {
        interviewId: interview.interviewId
      });
      setFinalResult(data);
      setCompleted(true);
      toast.success('Interview completed! 🎉');
    } catch (err) {
      toast.error('Failed to complete interview');
    }
  };

  const resetInterview = () => {
    setInterview(null);
    setCurrentQ(0);
    setAnswer('');
    setFeedback(null);
    setCompleted(false);
    setFinalResult(null);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-900/50 text-green-400';
    if (score >= 60) return 'bg-yellow-900/50 text-yellow-400';
    return 'bg-red-900/50 text-red-400';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          🎤 AI Mock Interview
        </h1>
        <p className="text-gray-400 mt-2">
          Practice with AI-generated questions and get instant detailed feedback
        </p>
      </div>

      {/* Configuration */}
      {!interview && !completed && (
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Configure Your Interview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Target Role *</label>
              <input
                type="text"
                value={config.role}
                onChange={(e) => setConfig({ ...config, role: e.target.value })}
                placeholder="e.g., React Developer, Data Engineer..."
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Interview Type</label>
              <select
                value={config.type}
                onChange={(e) => setConfig({ ...config, type: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="mixed">Mixed (Recommended)</option>
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="system-design">System Design</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
              <select
                value={config.difficulty}
                onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Number of Questions</label>
              <select
                value={config.questionCount}
                onChange={(e) => setConfig({ ...config, questionCount: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value={3}>3 Questions (Quick)</option>
                <option value={5}>5 Questions (Standard)</option>
                <option value={8}>8 Questions (Thorough)</option>
                <option value={10}>10 Questions (Full)</option>
              </select>
            </div>
          </div>

          <button
            onClick={startInterview}
            disabled={loading}
            className="mt-6 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Questions...
              </>
            ) : (
              <>▶ Start Interview</>
            )}
          </button>
        </div>
      )}

      {/* Interview In Progress */}
      {interview && !completed && (
        <div className="space-y-6 animate-slide-up">
          {/* Progress */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">
                Question {currentQ + 1} of {interview.questions.length}
              </span>
              <span className="text-indigo-400 text-sm font-medium">
                {Math.round(((currentQ + (feedback ? 1 : 0)) / interview.questions.length) * 100)}% complete
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-700 ease-out"
                style={{ width: `${((currentQ + (feedback ? 1 : 0)) / interview.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {currentQ + 1}
              </div>
              <h3 className="text-lg text-white font-medium leading-relaxed">
                {interview.questions[currentQ].question}
              </h3>
            </div>

            {interview.questions[currentQ].keyPoints && interview.questions[currentQ].keyPoints.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {interview.questions[currentQ].keyPoints.map((point, i) => (
                  <span key={i} className="px-2.5 py-1 bg-indigo-900/30 text-indigo-400 rounded-lg text-xs border border-indigo-800/50">
                    💡 {point}
                  </span>
                ))}
              </div>
            )}

            {/* Answer Input */}
            {!feedback && (
              <div>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here... Be detailed and specific. Explain your thought process."
                  rows={8}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-500 text-sm">{answer.length} characters</span>
                  <div className="flex gap-3">
                    <button
                      onClick={resetInterview}
                      className="px-4 py-2.5 bg-gray-800 text-gray-400 rounded-xl hover:text-white hover:bg-gray-700 transition-all text-sm"
                    >
                      Exit Interview
                    </button>
                    <button
                      onClick={submitAnswer}
                      disabled={submitting || !answer.trim()}
                      className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Evaluating...
                        </>
                      ) : (
                        <>Submit Answer →</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div className="space-y-4 animate-slide-up">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                  <div className={`text-4xl font-bold ${getScoreColor(feedback.score || 0)}`}>
                    {feedback.score || 0}%
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{feedback.feedback}</p>
                </div>

                {feedback.strengths && feedback.strengths.length > 0 && (
                  <div className="p-4 bg-green-900/20 border border-green-800/30 rounded-xl">
                    <h4 className="text-green-400 font-medium text-sm mb-2">✅ What you did well:</h4>
                    <ul className="space-y-1.5">
                      {feedback.strengths.map((s, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {feedback.improvements && feedback.improvements.length > 0 && (
                  <div className="p-4 bg-amber-900/20 border border-amber-800/30 rounded-xl">
                    <h4 className="text-amber-400 font-medium text-sm mb-2">⚡ To improve:</h4>
                    <ul className="space-y-1.5">
                      {feedback.improvements.map((s, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {feedback.idealAnswer && (
                  <div className="p-4 bg-indigo-900/20 border border-indigo-800/30 rounded-xl">
                    <h4 className="text-indigo-400 font-medium text-sm mb-2">💡 Ideal Answer:</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{feedback.idealAnswer}</p>
                  </div>
                )}

                <button
                  onClick={nextQuestion}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
                >
                  {currentQ < interview.questions.length - 1 ? 'Next Question →' : 'Complete Interview ✓'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed && finalResult && (
        <div className="space-y-6 animate-slide-up">
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">
              {finalResult.overallScore >= 80 ? '🏆' : finalResult.overallScore >= 60 ? '👍' : '💪'}
            </div>
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(finalResult.overallScore || 0)}`}>
              {finalResult.overallScore || 0}%
            </div>
            <h2 className="text-2xl font-bold text-white">Interview Complete!</h2>
            <p className="text-gray-400 mt-2 max-w-lg mx-auto">{finalResult.feedback}</p>
            <p className="text-gray-500 text-sm mt-2">
              Answered {finalResult.totalAnswered || 0} of {finalResult.totalQuestions || 0} questions
            </p>

            <button
              onClick={resetInterview}
              className="mt-6 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all inline-flex items-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              🔄 Start New Interview
            </button>
          </div>

          {/* Review All Questions */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">📝 Question Review</h3>
            <div className="space-y-4">
              {(finalResult.questions || []).map((q, i) => (
                <div key={i} className="bg-gray-800/40 rounded-xl p-5 border border-gray-700/50">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-white font-medium text-sm flex-1 pr-4">
                      <span className="text-indigo-400">Q{i + 1}:</span> {q.question}
                    </h4>
                    <span className={`text-sm font-bold px-3 py-1 rounded-lg flex-shrink-0 ${getScoreBg(q.score || 0)}`}>
                      {q.score || 0}%
                    </span>
                  </div>
                  {q.userAnswer && (
                    <div className="mb-2">
                      <p className="text-gray-500 text-xs font-medium mb-1">Your Answer:</p>
                      <p className="text-gray-400 text-sm">{q.userAnswer}</p>
                    </div>
                  )}
                  {q.aiFeedback && (
                    <div className="mt-2 pt-2 border-t border-gray-700/50">
                      <p className="text-gray-500 text-xs font-medium mb-1">AI Feedback:</p>
                      <p className="text-indigo-300 text-sm">{q.aiFeedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}