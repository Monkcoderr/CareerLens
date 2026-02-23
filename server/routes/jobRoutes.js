const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getJobs,
  addJob,
  updateJob,
  deleteJob,
  getJobStats
} = require('../controllers/jobController');

// IMPORTANT: stats route MUST be before /:id routes
router.get('/stats/overview', protect, getJobStats);
router.get('/', protect, getJobs);
router.post('/', protect, addJob);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

module.exports = router;