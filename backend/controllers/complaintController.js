const Complaint = require('../models/Complaint');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res, next) => {
  const { title, description, category, isAnonymous } = req.body;

  try {
    const complaint = await Complaint.create({
      title,
      description,
      category,
      isAnonymous: isAnonymous || false,
      user: req.user._id,
    });

    res.status(201).json(complaint);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({})
      .populate('user', 'name role')
      .sort({ createdAt: -1 });

    // Sanitize anonymous complaints so user info isn't exposed
    const sanitizedComplaints = complaints.map((complaint) => {
      const plainObj = complaint.toObject();
      if (plainObj.isAnonymous) {
        plainObj.user = { name: 'Anonymous User' };
      }
      return plainObj;
    });

    res.json(sanitizedComplaints);
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('user', 'name role');

    if (!complaint) {
      res.status(404);
      return next(new Error('Complaint not found'));
    }

    const plainObj = complaint.toObject();
    if (plainObj.isAnonymous) {
      plainObj.user = { name: 'Anonymous User' };
    }

    res.json(plainObj);
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Faculty/Admin only)
const updateComplaintStatus = async (req, res, next) => {
  const { status } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      return next(new Error('Complaint not found'));
    }

    complaint.status = status;
    const updatedComplaint = await complaint.save();

    res.json(updatedComplaint);
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote a complaint
// @route   PUT /api/complaints/:id/upvote
// @access  Private
const upvoteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      return next(new Error('Complaint not found'));
    }

    // Check if user already upvoted
    const alreadyUpvoted = complaint.upvotes.includes(req.user._id);

    if (alreadyUpvoted) {
      // Remove upvote
      complaint.upvotes = complaint.upvotes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
    } else {
      // Add upvote
      complaint.upvotes.push(req.user._id);
    }

    await complaint.save();
    res.json({ upvotesCount: complaint.upvotes.length, upvoted: !alreadyUpvoted });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  upvoteComplaint,
};
