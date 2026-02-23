const mongoose = require('mongoose');
const Job = require('../models/Job');

exports.getJobs = async (req, res) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const jobs = await Job.find(filter).sort({ updatedAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

exports.addJob = async (req, res) => {
  try {
    const { company, position, location, salary, url, status, notes } = req.body;

    if (!company || !position) {
      return res.status(400).json({ error: 'Company and position are required' });
    }

    const job = await Job.create({
      user: req.user._id,
      company,
      position,
      location: location || '',
      salary: salary || '',
      url: url || '',
      status: status || 'saved',
      notes: notes || '',
      appliedDate: status === 'applied' ? new Date() : null
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add job' });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job' });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ message: 'Job removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
};

exports.getJobStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const stats = await Job.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Job.countDocuments({ user: req.user._id });

    res.json({ stats, total });
  } catch (error) {
    console.error('Job stats error:', error.message);
    res.status(500).json({ error: 'Failed to fetch job stats' });
  }
};