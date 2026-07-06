const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  upvoteComplaint,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createComplaint)
  .get(protect, getComplaints);

router.route('/:id')
  .get(protect, getComplaintById);

router.route('/:id/status')
  .put(protect, authorize('faculty', 'admin'), updateComplaintStatus);

router.route('/:id/upvote')
  .put(protect, upvoteComplaint);

module.exports = router;
