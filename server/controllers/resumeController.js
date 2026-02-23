const Resume = require('../models/Resume');
const User = require('../models/User');
const aiService = require('../services/aiService');
const { parsePDF } = require('../services/pdfParser');

exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a resume file (PDF)' });
    }

    console.log('Parsing PDF:', req.file.originalname);
    const rawText = await parsePDF(req.file.buffer);

    if (!rawText || rawText.length < 50) {
      return res.status(400).json({ error: 'Could not extract enough text from PDF. Make sure it contains selectable text.' });
    }

    const targetRole = req.body.targetRole || req.user.targetRole || 'Software Developer';

    console.log('Analyzing resume with AI...');
    const analysis = await aiService.analyzeResume(rawText, targetRole);

    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      rawText: rawText,
      targetRole: targetRole,
      analysis: analysis
    });

    await User.findByIdAndUpdate(req.user._id, {
      resumeScore: analysis.overallScore || 0
    });

    res.json({
      id: resume._id,
      fileName: resume.fileName,
      analysis: analysis
    });
  } catch (error) {
    console.error('Resume analysis error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to analyze resume' });
  }
};

exports.getResumeHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-rawText')
      .limit(10);
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resume history' });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
};