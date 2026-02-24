const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const formatUser = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  targetRole: user.targetRole,
  experienceLevel: user.experienceLevel,
  skills: user.skills,
  resumeScore: user.resumeScore,
  interviewsTaken: user.interviewsTaken,
  avgInterviewScore: user.avgInterviewScore,
  token
});

exports.register = async (req, res) => {
  try {
    const { name, email, password, targetRole, experienceLevel } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      targetRole: targetRole || '',
      experienceLevel: experienceLevel || 'fresher'
    });

    const token = generateToken(user._id);
    res.status(201).json(formatUser(user, token));
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json(formatUser(user, token));
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.targetRole = req.body.targetRole !== undefined ? req.body.targetRole : user.targetRole;
    user.experienceLevel = req.body.experienceLevel || user.experienceLevel;
    user.skills = req.body.skills || user.skills;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      targetRole: updatedUser.targetRole,
      experienceLevel: updatedUser.experienceLevel,
      skills: updatedUser.skills,
      resumeScore: updatedUser.resumeScore,
      interviewsTaken: updatedUser.interviewsTaken,
      avgInterviewScore: updatedUser.avgInterviewScore
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};