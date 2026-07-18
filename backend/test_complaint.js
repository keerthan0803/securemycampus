const http = require('http');

async function test() {
  // Login first
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@student.com', password: 'testpassword' })
  });
  const loginData = await loginRes.json();
  const token = loginData.accessToken;
  console.log('Login:', loginData);
  
  if (!token) {
    console.log('Failed to get token, creating user...');
    // I can't register because of email verification!
    // Let's connect to mongoose and bypass it!
  }
}
test();
