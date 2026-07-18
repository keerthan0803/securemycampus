const sgMail = require('@sendgrid/mail');

// Set the SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
  const message = {
    to: options.email,
    from: {
      email: process.env.FROM_EMAIL,
      name: process.env.FROM_NAME || 'Secure My Campus',
    },
    subject: options.subject,
    text: options.message,
    html: options.html, // Optional HTML version
  };

  try {
    const info = await sgMail.send(message);
    console.log('Message sent via SendGrid:', info[0].headers['x-message-id']);
  } catch (error) {
    console.error('SendGrid Error:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error; // Rethrow the error so the controller handles it
  }
};

module.exports = sendEmail;
