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

  const isAuthPage = currentPage === 'signin' || currentPage === 'signup';

  const renderContent = () => {
    switch (currentPage) {
      case 'signin':
        return <SignIn onNavigate={setCurrentPage} />;
      case 'signup':
        return <SignUp onNavigate={setCurrentPage} />;
      case 'complaints':
        return <Complaints onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <FacultyDashboard onNavigate={setCurrentPage} />;
      case 'support':
        return <Support onNavigate={setCurrentPage} />;
      case 'profile':
        return <Profile onNavigate={setCurrentPage} />;
      case 'form':
        return <Form onNavigate={setCurrentPage} />;
      case 'verify-email':
        return <VerifyEmail onNavigate={setCurrentPage} />;
      case 'home':
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background text-on-background selection:bg-primary-fixed-dim selection:text-on-primary-fixed">
      {/* Global Header Navigation */}
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />

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
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}
