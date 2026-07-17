const Complaint = require('../models/Complaint');
const User = require('../models/User');

const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });

    let safetyRating = 100;
    if (totalComplaints > 0) {
      safetyRating = Math.round((resolvedComplaints / totalComplaints) * 100);
    }

    res.status(200).json({
      resolvedIssues: resolvedComplaints,
      activeUsers: totalUsers,
      securitySupport: 24, // Static for "24/7" support
      safetyRating: safetyRating
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats
};
