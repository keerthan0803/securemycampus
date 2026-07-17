require('dotenv').config();
const sendEmail = require('./utils/email');

async function test() {
  try {
    await sendEmail({
      email: 'kranthikumarsamudrala381@gmail.com', // Sending to themselves
      subject: 'Test Email',
      message: 'This is a test email to verify credentials.',
    });
    console.log('Test email sent successfully!');
  } catch (err) {
    console.error('Failed to send test email:', err.message);
    if (err.response) console.error(err.response);
  }
}
test();
