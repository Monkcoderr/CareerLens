import { useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../utils/api';

export default function CoverLetterGen() {
  const [formData, setFormData] = useState({
    resumeText: '',
    jobDescription: '',
    company: '',
    position: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generate = async () => {
    const { resumeText, jobDescription, company, position } = formData;
    if (!resumeText || !jobDescription || !company || !position) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/ai/cover-letter', formData);
      setResult(data);
      toast.success('Cover letter generated! ✨');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate cover letter');
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (result?.coverLetter) {
      navigator.clipboard.writeText(result.coverLetter);
      toast.success('Copied to clipboard! 📋');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          ✉️ AI Cover Letter Generator
        </h1>
        <p className="text-gray-400 mt-2">
          Generate personalized, ATS-optimized cover letters tailored to each job
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company *</label>
              <input
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g., Google"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Position *</label>
              <input
                name="position"
                type="text"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g., Frontend Developer"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Resume / Key Experience *
            </label>
            <textarea
              name="resumeText"
              value={formData.resumeText}
              onChange={handleChange}
              placeholder="Paste your resume text or key highlights, skills, experience..."
              rows={7}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Description *</label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Paste the complete job description here..."
              rows={7}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/25"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>✨ Generate Cover Letter</>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="space-y-4">
          {result ? (
            <>
              <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Generated Cover Letter</h3>
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition text-gray-400 hover:text-white text-sm flex items-center gap-2"
                  >
                    📋 Copy
                  </button>
                </div>
                <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/50">
                  <p className="text-gray-300 whitespace-pre-line leading-relaxed text-sm">
                    {result.coverLetter}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Match Score */}
                <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm font-medium">Job Match Score</span>
                    <span
                      className={`font-bold text-lg ${
                        (result.matchScore || 0) >= 80
                          ? 'text-green-400'
                          : (result.matchScore || 0) >= 60
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {result.matchScore || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                    <div
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${result.matchScore || 0}%`,
                        backgroundColor:
                          (result.matchScore || 0) >= 80 ? '#22c55e' : (result.matchScore || 0) >= 60 ? '#eab308' : '#ef4444'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Matching Skills */}
                {result.highlightedSkills && result.highlightedSkills.length > 0 && (
                  <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-2 font-medium">🎯 Matching Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {result.highlightedSkills.map((s, i) => (
                        <span key={i} className="px-3 py-1.5 bg-indigo-900/30 text-indigo-400 rounded-full text-xs font-medium border border-indigo-800/50">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {result.tips && result.tips.length > 0 && (
                  <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-2 font-medium">💡 Additional Tips</p>
                    <ul className="space-y-2">
                      {result.tips.map((t, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-yellow-400 mt-0.5">→</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center p-8">
                <span className="text-6xl block mb-4">✉️</span>
                <p className="text-gray-500 text-lg">Your generated cover letter</p>
                <p className="text-gray-600 text-sm mt-1">will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}