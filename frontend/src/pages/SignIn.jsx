import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { GoogleLogin } from '@react-oauth/google';

export default function SignIn({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setError(null);
    // Actual login API call
    fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || 'Login failed');
          });
        }
        return res.json();
      })
      .then((data) => {
        setIsLoading(false);
        localStorage.setItem('userInfo', JSON.stringify(data));
        alert(`Welcome back, ${data.name}! You are logged in as a ${data.role}.`);
        onNavigate('home');
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message || 'Server error, please try again.');
      });
  };

  const handleGoogleLogin = (googleToken) => {
    setError(null);
    setIsLoading(true);
    fetch('http://localhost:5000/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: googleToken }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || 'Google authentication failed');
          });
        }
        return res.json();
      })
      .then((data) => {
        setIsLoading(false);
        localStorage.setItem('userInfo', JSON.stringify(data));
        alert(`Welcome back, ${data.name}! You are logged in as a ${data.role}.`);
        onNavigate('home');
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message || 'Server error, please try again.');
      });
  };

  return (
    <div className="w-full flex justify-center px-md md:px-0">
      <Card className="max-w-[440px] p-xl md:p-2xl flex flex-col gap-lg" isGlass={true}>
        <header className="text-center">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-xs">
            Welcome Back
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Access your campus security dashboard
          </p>
        </header>

        {/* Social Login */}
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleLogin(credentialResponse.credential);
            }}
            onError={() => {
              setError('Google Authentication failed. Please try again.');
            }}
            useOneTap
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-sm select-none">
          <div className="h-[1px] flex-grow bg-outline-variant"></div>
          <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">
            or email
          </span>
          <div className="h-[1px] flex-grow bg-outline-variant"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <Input
            label="Campus Email"
            id="email"
            type="email"
            icon="mail"
            placeholder="name@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="flex flex-col gap-xs">
            <Input
              label="Password"
              id="password"
              type="password"
              icon="lock"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-end mt-xs">
              <button 
                type="button"
                className="font-label-md text-label-md text-primary hover:underline cursor-pointer border-none bg-transparent p-0 focus:outline-none"
                onClick={() => alert('Reset password link has been sent to your university email.')}
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Mock Error Message Display */}
          {error && (
            <div className="flex items-start gap-xs p-md bg-error-container/30 border border-error/10 rounded-lg animate-in fade-in slide-in-from-top-2">
              <span className="material-symbols-outlined text-error text-[20px] select-none">
                error
              </span>
              <p className="font-caption text-caption text-on-error-container">
                {error}
              </p>
            </div>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            icon="arrow_forward" 
            isLoading={isLoading}
            className="mt-sm"
          >
            Sign In
          </Button>
        </form>

        <footer className="text-center mt-md">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Don't have an account?{' '}
            <button 
              onClick={() => onNavigate('signup')} 
              className="text-primary font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer focus:outline-none"
            >
              Sign Up
            </button>
          </p>
        </footer>
      </Card>
    </div>
  );
}
