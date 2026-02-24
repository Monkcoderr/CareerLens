import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import toast from 'react-hot-toast';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function ResumeUpload() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [fileName, setFileName] = useState('');
  const { updateUser } = useAuth();

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setFileName(file.name);
      setLoading(true);
      setAnalysis(null);

      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetRole', targetRole);

      try {
        const { data } = await API.post('/resume/analyze', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 120000
        });
        setAnalysis(data.analysis);
        updateUser({ resumeScore: data.analysis.overallScore });
        toast.success('Resume analyzed successfully! 🎉');
      } catch (err) {
        console.error('Resume analysis error:', err);
        toast.error(err.response?.data?.error || 'Failed to analyze resume. Please try again.');
      }
      setLoading(false);
    },
    [targetRole, updateUser]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: loading
  });

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    return '#ef4444';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-900/50 text-green-400';
    if (score >= 60) return 'bg-yellow-900/50 text-yellow-400';
    return 'bg-red-900/50 text-red-400';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          📄 AI Resume Analyzer
        </h1>
        <p className="text-gray-400 mt-2">
          Upload your resume and get instant AI-powered feedback with ATS compatibility score
        </p>
      </div>

      {/* Target Role */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Target Role (for better, role-specific analysis)
        </label>
        <input
          type="text"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g., Full Stack Developer, Data Scientist, Product Manager..."
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
      </div>

      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 ${
          loading
            ? 'border-indigo-500/50 bg-indigo-500/5 cursor-wait'
            : isDragActive
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]'
            : 'border-gray-700 hover:border-indigo-500/50 bg-gray-900/80 hover:bg-gray-900'
        }`}
      >
        <input {...getInputProps()} />
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
            </div>
            <div>
              <p className="text-indigo-300 text-lg font-medium">AI is analyzing your resume...</p>
              <p className="text-gray-500 mt-1">Checking ATS compatibility, keywords, formatting & more</p>
              <p className="text-gray-600 text-sm mt-2">This may take 15-30 seconds</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 flex items-center justify-center border border-indigo-500/20">
              <span className="text-4xl">📤</span>
            </div>
            <div>
              <p className="text-white text-lg font-medium">
                {isDragActive ? 'Drop your resume here!' : 'Drag & drop your resume here'}
              </p>
              <p className="text-gray-500 mt-1">or click to browse • PDF files only • Max 5MB</p>
            </div>
            {fileName && !analysis && (
              <p className="text-indigo-400 text-sm">Last uploaded: {fileName}</p>
            )}
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6 animate-slide-up">
          {/* Overall Score */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-36 h-36 flex-shrink-0">
                <CircularProgressbar
                  value={analysis.overallScore || 0}
                  text={`${analysis.overallScore || 0}%`}
                  styles={buildStyles({
                    textColor: '#ffffff',
                    textSize: '22px',
                    pathColor: getScoreColor(analysis.overallScore || 0),
                    trailColor: '#374151',
                    pathTransitionDuration: 1.5
                  })}
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-white">Overall Resume Score</h2>
                <div className="flex flex-wrap items-center gap-4 mt-3 justify-center md:justify-start">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                    <span className="text-gray-300 text-sm">
                      ATS Score: <strong className="text-indigo-400">{analysis.atsCompatibility || 0}%</strong>
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 mt-3 text-sm">
                  {(analysis.overallScore || 0) >= 80
                    ? '🎉 Excellent! Your resume is well-optimized for ATS and recruiters.'
                    : (analysis.overallScore || 0) >= 60
                    ? '⚡ Good foundation! Follow the suggestions below to boost your score.'
                    : '🔧 Needs improvement. Follow the detailed recommendations below.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section Scores */}
          {analysis.sections && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(analysis.sections).map(([key, section]) => (
                <div key={key} className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold capitalize text-sm">{key}</h3>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${getScoreBg(section.score || 0)}`}>
                      {section.score || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
                    <div
                      className="h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${section.score || 0}%`,
                        backgroundColor: getScoreColor(section.score || 0)
                      }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{section.feedback || 'No feedback available'}</p>
                </div>
              ))}
            </div>
          )}

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.strengths && analysis.strengths.length > 0 && (
              <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2 mb-4">
                  ✅ Strengths
                </h3>
                <ul className="space-y-3">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                      <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.improvements && analysis.improvements.length > 0 && (
              <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-amber-400 flex items-center gap-2 mb-4">
                  ⚡ Improvements
                </h3>
                <ul className="space-y-3">
                  {analysis.improvements.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                      <span className="text-amber-400 mt-0.5 flex-shrink-0">→</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Keywords */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">🔑 Keyword Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-3 font-medium">Found Keywords ✅</p>
                <div className="flex flex-wrap gap-2">
                  {(analysis.keywords || []).map((k, i) => (
                    <span key={i} className="px-3 py-1.5 bg-green-900/30 text-green-400 rounded-full text-xs font-medium border border-green-800/50">
                      {k}
                    </span>
                  ))}
                  {(!analysis.keywords || analysis.keywords.length === 0) && (
                    <span className="text-gray-600 text-sm">No keywords detected</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-3 font-medium">Missing Keywords ❌</p>
                <div className="flex flex-wrap gap-2">
                  {(analysis.missingKeywords || []).map((k, i) => (
                    <span key={i} className="px-3 py-1.5 bg-red-900/30 text-red-400 rounded-full text-xs font-medium border border-red-800/50">
                      {k}
                    </span>
                  ))}
                  {(!analysis.missingKeywords || analysis.missingKeywords.length === 0) && (
                    <span className="text-gray-600 text-sm">No missing keywords</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}