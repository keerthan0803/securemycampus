import React, { useState } from 'react';

export default function Navbar({ onNavigate, currentPage }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
  const isLoggedIn = !!userInfo && userInfo.isVerified;

  // University Logo from the approved designs
  const logoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDPzRHWvLAUl6hm8aTooSB_FyFbtKAuWcJFT9-q1BXAbyGlDWkVzFjJVHpEzv7y_U-whd49OOddpYuqceChUHKmtbCm_YSwTBKtp1csEYBk6SxCIRT8dKQcdQC-MBclTzEPbjfi0rk_QPFYW0eK_s30DlQm8EW2ilNCkfyPzwjqi4hXCcSMELMsVA9_wAAtkftG1E3i6iDdpS5gO0E-vT-a-SwQivlI1EHtjGHeetwpMkl9cjsjxRPrbDma6Jk1ErOtBg";

  const handleLinkClick = (page, e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    onNavigate(page);
  };

  return (
    <header className="navbar fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-md border-b border-primary/10 shadow-sm transition-all duration-200">
      <div className="flex justify-between items-center px-gutter h-16 w-full">
        {/* Brand/Logo */}
        <button
          onClick={(e) => handleLinkClick('home', e)}
          className="flex items-center gap-sm select-none cursor-pointer border-none bg-transparent p-0 text-left focus:outline-none"
        >
          <img
            alt="University Logo"
            className="h-10 w-10 object-contain rounded-full border border-primary/10"
            src={logoUrl}
          />
          <span className="font-headline-md text-headline-md font-bold text-primary hidden sm:inline-block">
            Secure My Campus
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-lg nav-links">
          <a
            onClick={(e) => handleLinkClick('home', e)}
            className={`font-label-md text-label-md py-xs cursor-pointer border-none bg-transparent ${currentPage === 'home'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-secondary transition-colors duration-200'
              }`}
            href="#"
          >
            Home
          </a>
          <a
            onClick={(e) => handleLinkClick('complaints', e)}
            className={`font-label-md text-label-md py-xs cursor-pointer border-none bg-transparent ${currentPage === 'complaints'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-secondary transition-colors duration-200'
              }`}
            href="#"
          >
            Complaint
          </a>
          {isLoggedIn && (
            <a
              onClick={(e) => handleLinkClick('dashboard', e)}
              className={`font-label-md text-label-md py-xs cursor-pointer border-none bg-transparent ${currentPage === 'dashboard'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-secondary transition-colors duration-200'
                }`}
              href="#"
            >
              Dashboard
            </a>
          )}
          <a
            onClick={(e) => handleLinkClick('support', e)}
            className={`font-label-md text-label-md py-xs cursor-pointer border-none bg-transparent ${currentPage === 'support'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-secondary transition-colors duration-200'
              }`}
            href="#"
          >
            FAQs
          </a>
        </nav>

        {/* Desktop CTA Action Buttons */}
        <div className="flex items-center gap-md">
          <div className="hidden sm:flex items-center gap-sm">
            {isLoggedIn ? (
              <button 
                onClick={() => onNavigate('profile')}
                className={`flex items-center justify-center cursor-pointer rounded-full transition-transform hover:scale-105 active:scale-95 ${
                  currentPage === 'profile' ? 'ring-2 ring-primary ring-offset-2' : ''
                } bg-transparent border-none p-0`}
                aria-label="Profile"
              >
                <img 
                  src="/user.png" 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border border-outline/30 shadow-sm bg-surface" 
                />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('signin')}
                  className={`px-md py-sm font-label-md text-label-md rounded-lg transition-all cursor-pointer ${currentPage === 'signin'
                      ? 'bg-primary text-on-primary shadow-md hover:translate-y-[-2px] active:scale-95 border border-primary'
                      : 'text-primary border border-primary/20 hover:bg-primary/5 bg-transparent'
                    }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className={`px-md py-sm font-label-md text-label-md rounded-lg transition-all cursor-pointer ${currentPage === 'signup'
                      ? 'bg-primary text-on-primary shadow-md hover:translate-y-[-2px] active:scale-95 border border-primary'
                      : 'text-primary border border-primary/20 hover:bg-primary/5 bg-transparent'
                    }`}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggler */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-primary cursor-pointer md:hidden bg-transparent border-none p-1 focus:outline-none select-none flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-primary/10 py-md px-gutter animate-fade-in shadow-lg">
          <nav className="flex flex-col gap-md py-sm">
            <a
              onClick={(e) => handleLinkClick('home', e)}
              className={`font-label-md text-label-md py-xs ${currentPage === 'home' ? 'text-primary font-bold' : 'text-on-surface-variant'
                }`}
              href="#"
            >
              Home
            </a>
            <a
              onClick={(e) => handleLinkClick('complaints', e)}
              className={`font-label-md text-label-md py-xs ${currentPage === 'complaints' ? 'text-primary font-bold' : 'text-on-surface-variant'
                }`}
              href="#"
            >
              Complaint
            </a>
            {isLoggedIn && (
              <a
                onClick={(e) => handleLinkClick('dashboard', e)}
                className={`font-label-md text-label-md py-xs ${currentPage === 'dashboard' ? 'text-primary font-bold' : 'text-on-surface-variant'
                  }`}
                href="#"
              >
                Dashboard
              </a>
            )}
            <a
              onClick={(e) => handleLinkClick('support', e)}
              className={`font-label-md text-label-md py-xs ${currentPage === 'support' ? 'text-primary font-bold' : 'text-on-surface-variant'
                }`}
              href="#"
            >
              FAQs
            </a>

            <div className="flex flex-col gap-sm pt-md border-t border-outline-variant/30">
              {isLoggedIn ? (
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('profile');
                  }}
                  className={`flex items-center justify-center gap-sm w-full py-xs rounded-lg text-center cursor-pointer transition-all border ${
                    currentPage === 'profile' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-transparent bg-transparent hover:bg-surface-variant/20'
                  }`}
                >
                  <img src="/user.png" alt="Profile" className="w-8 h-8 rounded-full object-cover shadow-sm" />
                  <span className={`font-label-md text-label-md ${
                    currentPage === 'profile' ? 'text-primary font-bold' : 'text-on-surface-variant'
                  }`}>Profile</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavigate('signin');
                    }}
                    className={`w-full py-sm font-label-md text-label-md rounded-lg text-center cursor-pointer transition-all ${currentPage === 'signin'
                        ? 'bg-primary text-on-primary shadow-md hover:bg-primary/95 border border-primary'
                        : 'text-primary border border-primary/20 hover:bg-primary/5 bg-transparent'
                      }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavigate('signup');
                    }}
                    className={`w-full py-sm font-label-md text-label-md rounded-lg text-center cursor-pointer transition-all ${currentPage === 'signup'
                        ? 'bg-primary text-on-primary shadow-md hover:bg-primary/95 border border-primary'
                        : 'text-primary border border-primary/20 hover:bg-primary/5 bg-transparent'
                      }`}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
