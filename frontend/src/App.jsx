import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Complaints from './pages/Complaints';
import FacultyDashboard from './pages/FacultyDashboard';
import Support from './pages/Support';
import Profile from './pages/Profile';
import Form from './pages/form/Form';
import VerifyEmail from './pages/VerifyEmail';

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    if (window.location.pathname.startsWith('/verify-email')) {
      return 'verify-email';
    }
    return 'home';
  });

  const handleNavigate = (page) => {
    setCurrentPage(page);
    // Reset the URL to root if navigating away from a deep link
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
  };

  const isAuthPage = currentPage === 'signin' || currentPage === 'signup';

  const renderContent = () => {
    switch (currentPage) {
      case 'signin':
        return <SignIn onNavigate={handleNavigate} />;
      case 'signup':
        return <SignUp onNavigate={handleNavigate} />;
      case 'complaints':
        return <Complaints onNavigate={handleNavigate} />;
      case 'dashboard':
        return <FacultyDashboard onNavigate={handleNavigate} />;
      case 'support':
        return <Support onNavigate={handleNavigate} />;
      case 'profile':
        const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
        if (!userInfo || !userInfo.isVerified) {
          localStorage.removeItem('userInfo');
          return <SignIn onNavigate={handleNavigate} />;
        }
        return <Profile onNavigate={handleNavigate} />;
      case 'form':
        return <Form onNavigate={handleNavigate} />;
      case 'verify-email':
        return <VerifyEmail onNavigate={handleNavigate} />;
      case 'home':
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background text-on-background selection:bg-primary-fixed-dim selection:text-on-primary-fixed">
      {/* Global Header Navigation */}
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      {/* Rich Decorative Gradient Ambient Circles (only show on auth pages or background overlay) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary-fixed/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-secondary-fixed/15 blur-[100px] rounded-full"></div>
      </div>

      {/* Main Layout Area */}
      <main 
        className={
          isAuthPage 
            ? "flex-grow flex items-center justify-center pt-28 pb-16 px-md relative z-10" 
            : "flex-grow pt-16 relative z-10"
        }
      >
        {renderContent()}
      </main>

      {/* Global Footer Section */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
