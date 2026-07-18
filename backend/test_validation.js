require('dotenv').config();
const mongoose = require('mongoose');
const Complaint = require('./models/Complaint');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');
  try {
    const complaint = new Complaint({
      title: "Test title",
      description: "Test desc",
      category: "harassment",
      priority: "medium",
      location: "Campus",
      phone: "+911234567890",
      isAnonymous: false,
      user: new mongoose.Types.ObjectId() // Fake user ID
    });
    
    // validate locally
    await complaint.validate();
    console.log('Validation passed!');
  } catch (err) {
    console.error('Validation failed:', err);
  }
  process.exit();
}
run();
