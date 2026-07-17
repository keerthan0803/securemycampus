import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function VerifyEmail({ onNavigate }) {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    // Extract token from the URL since we are not using React Router
    const pathParts = window.location.pathname.split('/');
    const tokenIndex = pathParts.indexOf('verify-email');
    const token = tokenIndex !== -1 && tokenIndex + 1 < pathParts.length ? pathParts[tokenIndex + 1] : null;

    if (!token) {
      setStatus('error');
      setMessage('No verification token provided. The link might be invalid or expired.');
      return;
    }

    // Call the backend verify endpoint
    fetch(`http://localhost:5000/api/auth/verify/${token}`, {
      method: 'POST', // or GET depending on backend setup, we used POST in authRoutes
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || 'Verification failed');
          });
        }
        return res.json();
      })
      .then((data) => {
        setStatus('success');
        setMessage(data.message || 'Your email has been verified successfully!');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Invalid or expired verification token.');
      });
  }, []);

  return (
    <div className="w-full min-h-[60vh] flex justify-center items-center px-gutter relative z-10">
      <Card className="max-w-[480px] p-lg md:p-xl flex flex-col gap-lg bg-surface-container-lowest text-center">
        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-md">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <h1 className="font-headline-md text-headline-md text-primary">Verifying Email</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-md animate-fade-in">
            <span className="material-symbols-outlined text-[64px] text-primary">
              check_circle
            </span>
            <h1 className="font-headline-md text-headline-md text-primary">Verification Successful</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">{message}</p>
            <Button 
              variant="primary" 
              onClick={() => onNavigate('signin')}
              className="mt-md"
            >
              Go to Sign In
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-md animate-fade-in">
            <span className="material-symbols-outlined text-[64px] text-error">
              error
            </span>
            <h1 className="font-headline-md text-headline-md text-error">Verification Failed</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">{message}</p>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('home')}
              className="mt-md"
            >
              Return Home
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
