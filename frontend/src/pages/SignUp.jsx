import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { GoogleLogin } from '@react-oauth/google';

export default function SignUp({ onNavigate }) {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!username || !phone || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password entry.');
      return;
    }

    if (!termsAccepted) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    // Actual database registration API
    fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: username,
        email: email,
        password: password,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || 'Registration failed');
          });
        }
        return res.json();
      })
      .then((data) => {
        setIsLoading(false);
        alert('Registration successful! Please login.');
        
        // Reset fields
        setUsername('');
        setPhone('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTermsAccepted(false);
        
        // Redirect to Sign In page
        onNavigate('signin');
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message || 'Server error, please try again later.');
      });
  };

  const handleGoogleSignup = (googleToken) => {
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
            throw new Error(data.message || 'Google signup failed');
          });
        }
        return res.json();
      })
      .then((data) => {
        setIsLoading(false);
        localStorage.setItem('userInfo', JSON.stringify(data));
        alert(`Registration successful! Welcome, ${data.name}. Logged in as ${data.role}.`);
        onNavigate('home');
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message || 'Server error, please try again.');
      });
  };

  return (
    <div className="w-full flex justify-center px-gutter relative z-10">
      <Card className="max-w-[480px] p-lg md:p-xl flex flex-col gap-lg bg-surface-container-lowest" isGlass={false}>
        {/* Header Section */}
        <div className="text-center">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">
            Create Account
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Join the community and stay protected on campus.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-lg">
          {/* Username Field */}
          <Input
            label="Username"
            id="username"
            type="text"
            icon="person"
            placeholder="johndoe_secure"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* Phone Number Field */}
          <Input
            label="Phone Number"
            id="phone"
            type="tel"
            icon="phone"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          {/* Email Field */}
          <Input
            label="Email"
            id="email"
            type="email"
            icon="mail"
            placeholder="student@securemycampus.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Field */}
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

          {/* Confirm Password Field */}
          <Input
            label="Confirm Password"
            id="confirm-password"
            type="password"
            icon="verified_user"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* Terms and Conditions */}
          <div className="flex items-start gap-sm py-xs">
            <input
              className="mt-1 w-4 h-4 text-primary rounded border-outline focus:ring-primary cursor-pointer"
              id="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label className="font-caption text-caption text-on-surface-variant leading-tight cursor-pointer select-none" htmlFor="terms">
              I agree to the <a className="text-primary underline" href="#">Terms of Service</a> and <a className="text-primary underline" href="#">Privacy Policy</a>.
            </label>
          </div>

          {/* Error Message Panel */}
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

          {/* Submit Button */}
          <Button 
            type="submit" 
            variant="primary" 
            icon="arrow_forward" 
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-md my-sm select-none">
          <div className="flex-grow h-[1px] bg-outline-variant"></div>
          <span className="font-label-md text-label-md text-outline">OR</span>
          <div className="flex-grow h-[1px] bg-outline-variant"></div>
        </div>

        {/* Social Signup */}
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleSignup(credentialResponse.credential);
            }}
            onError={() => {
              setError('Google Authentication failed. Please try again.');
            }}
            useOneTap
          />
        </div>

        {/* Redirect to Sign In */}
        <div className="mt-sm text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Already have an account?{' '}
            <button 
              onClick={() => onNavigate('signin')} 
              className="text-primary font-label-md text-label-md hover:underline transition-all bg-transparent border-none p-0 cursor-pointer focus:outline-none"
            >
              Sign In
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
