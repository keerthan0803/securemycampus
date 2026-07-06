import React from 'react';

export default function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-xl bg-surface-container-lowest border-t border-outline-variant shadow-sm mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-gutter max-w-container-max mx-auto gap-md w-full">
        <div className="flex items-center gap-sm">
          <button 
            onClick={() => onNavigate?.('home')}
            className="font-label-md text-label-md font-bold text-primary cursor-pointer border-none bg-transparent p-0 text-left focus:outline-none"
          >
            Secure My Campus
          </button>
          <span className="text-caption font-caption text-on-surface-variant/40 select-none">|</span>
          <span className="text-caption font-caption text-on-surface-variant opacity-80 select-none">
            © {currentYear}. All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-xl">
          <a className="text-on-surface-variant hover:text-primary transition-colors font-caption text-caption" href="#">
            Privacy Policy
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-caption text-caption" href="#">
            FAQs
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-caption text-caption" href="#">
            Support
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-caption text-caption" href="#">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
