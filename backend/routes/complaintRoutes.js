const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  upvoteComplaint,
  getHarassmentComplaints,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createComplaint)
  .get(protect, getComplaints);

router.route('/harassment')
  .get(protect, authorize('faculty', 'admin'), getHarassmentComplaints);

router.route('/:id')
  .get(protect, getComplaintById);

router.route('/:id/status')
  .put(protect, authorize('faculty', 'admin'), updateComplaintStatus);

router.route('/:id/upvote')
  .put(protect, upvoteComplaint);

module.exports = router;
