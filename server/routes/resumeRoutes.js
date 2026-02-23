const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  analyzeResume,
  getResumeHistory,
  getResumeById
} = require('../controllers/resumeController');

router.post('/analyze', protect, upload.single('resume'), analyzeResume);
router.get('/history', protect, getResumeHistory);
router.get('/:id', protect, getResumeById);

module.exports = router;