const aiService = require('../services/aiService');
const Interview = require('../models/Interview');
const User = require('../models/User');

exports.startInterview = async (req, res) => {
  try {
    const { role, type, difficulty, questionCount } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'Please specify a target role' });
    }

    const count = Math.min(questionCount || 5, 10);

    console.log(`Generating ${count} ${type} questions for ${role}...`);
    const questions = await aiService.generateInterviewQuestions(
      role,
      type || 'mixed',
      difficulty || 'medium',
      count
    );

    const interview = await Interview.create({
      user: req.user._id,
      role,
      type: type || 'mixed',
      difficulty: difficulty || 'medium',
      questions: questions.map((q) => ({
        question: q.question,
        idealAnswer: q.idealAnswer || ''
      }))
    });

    res.json({
      interviewId: interview._id,
      questions: questions.map((q) => ({
        question: q.question,
        keyPoints: q.keyPoints || []
      }))
    });
  } catch (error) {
    console.error('Start interview error:', error.message);
    res.status(500).json({ error: 'Failed to generate interview questions' });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer } = req.body;

    if (!interviewId || questionIndex === undefined || !answer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const interview = await Interview.findOne({
      _id: interviewId,
      user: req.user._id
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    if (questionIndex < 0 || questionIndex >= interview.questions.length) {
      return res.status(400).json({ error: 'Invalid question index' });
    }

    const question = interview.questions[questionIndex];

    console.log(`Evaluating answer for question ${questionIndex + 1}...`);
    const evaluation = await aiService.evaluateAnswer(
      question.question,
      answer,
      interview.role
    );

    interview.questions[questionIndex].userAnswer = answer;
    interview.questions[questionIndex].aiFeedback = evaluation.feedback || '';
    interview.questions[questionIndex].score = evaluation.score || 0;

    await interview.save();

    res.json({
      score: evaluation.score || 0,
      feedback: evaluation.feedback || '',
      strengths: evaluation.strengths || [],
      improvements: evaluation.improvements || [],
      idealAnswer: evaluation.idealAnswer || ''
    });
  } catch (error) {
    console.error('Submit answer error:', error.message);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
};

exports.completeInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findOne({
      _id: interviewId,
      user: req.user._id
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    const answeredQuestions = interview.questions.filter(
      (q) => q.userAnswer && q.score > 0
    );

    let avgScore = 0;
    if (answeredQuestions.length > 0) {
      avgScore = Math.round(
        answeredQuestions.reduce((sum, q) => sum + q.score, 0) / answeredQuestions.length
      );
    }

    let feedback = '';
    if (avgScore >= 80) {
      feedback = 'Excellent performance! You demonstrated strong knowledge and communication skills. Keep it up!';
    } else if (avgScore >= 60) {
      feedback = 'Good effort! You have a solid foundation. Focus on the improvement areas to reach the next level.';
    } else if (avgScore >= 40) {
      feedback = 'Decent attempt. Review the ideal answers and practice more. You are on the right track!';
    } else {
      feedback = 'Keep practicing! Review the concepts and try again. Every practice session makes you better.';
    }

    interview.overallScore = avgScore;
    interview.overallFeedback = feedback;
    interview.completedAt = new Date();
    await interview.save();

    const user = await User.findById(req.user._id);
    user.interviewsTaken = (user.interviewsTaken || 0) + 1;

    const allCompletedInterviews = await Interview.find({
      user: req.user._id,
      completedAt: { $ne: null }
    });

    if (allCompletedInterviews.length > 0) {
      user.avgInterviewScore = Math.round(
        allCompletedInterviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) /
          allCompletedInterviews.length
      );
    }

    await user.save();

    res.json({
      overallScore: avgScore,
      feedback: feedback,
      questions: interview.questions,
      totalAnswered: answeredQuestions.length,
      totalQuestions: interview.questions.length
    });
  } catch (error) {
    console.error('Complete interview error:', error.message);
    res.status(500).json({ error: 'Failed to complete interview' });
  }
};

exports.generateCoverLetter = async (req, res) => {
  try {
    const { resumeText, jobDescription, company, position } = req.body;

    if (!resumeText || !jobDescription || !company || !position) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    console.log(`Generating cover letter for ${position} at ${company}...`);
    const result = await aiService.generateCoverLetter(
      resumeText,
      jobDescription,
      company,
      position
    );

    res.json(result);
  } catch (error) {
    console.error('Cover letter error:', error.message);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
};

exports.skillGapAnalysis = async (req, res) => {
  try {
    const { skills, targetRole } = req.body;

    if (!skills || !targetRole) {
      return res.status(400).json({ error: 'Skills and target role are required' });
    }

    const skillArray = Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim());

    console.log(`Analyzing skill gap for ${targetRole}...`);
    const result = await aiService.analyzeSkillGap(skillArray, targetRole);

    res.json(result);
  } catch (error) {
    console.error('Skill gap error:', error.message);
    res.status(500).json({ error: 'Failed to analyze skill gap' });
  }
};

exports.getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-__v');

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch interview history' });
  }
};