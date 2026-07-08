import React, { useEffect } from 'react';
import Hero from '../components/home/Hero';
import Announcements from '../components/home/Announcements';
import Features from '../components/home/Features';
import Stats from '../components/home/Stats';
import About from '../components/home/About';
import Contact from '../components/home/Contact';
import EmergencyFab from '../components/home/EmergencyFab';

export default function Home({ onNavigate }) {
  const isLoggedIn = !!localStorage.getItem('userInfo');

  useEffect(() => {
    // Add scroll listener for navbar shadow customization (if class exists)
    const handleScroll = () => {
      const nav = document.querySelector('.navbar');
      if (nav) {
        if (window.scrollY > 50) {
          nav.classList.add('shadow-md');
          nav.classList.remove('shadow-sm');
        } else {
          nav.classList.add('shadow-sm');
          nav.classList.remove('shadow-md');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Setup intersection observer for entry animations
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
      '.features > div, .announcement-section > div, .stats > div, .contact > div'
    );

    animatedElements.forEach((el) => {
      el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      animatedElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  const handleEmergencyClick = () => {
    alert('Emergency Hotline Triggered: Dialing +91 040 1234 5678. Help is on the way!');
  };

  const handleFeatureClick = (featureId) => {
    if (featureId === 'complaint') {
      onNavigate(isLoggedIn ? 'complaints' : 'signup'); // Navigate to complaints if logged in, else prompt to register
    } else if (featureId === 'help') {
      // Scroll to contact section
      const contactSection = document.querySelector('.contact');
      contactSection?.scrollIntoView({ behavior: 'smooth' });
    } else if (featureId === 'profile') {
      onNavigate(isLoggedIn ? 'profile' : 'signin');
    } else {
      onNavigate(isLoggedIn ? 'dashboard' : 'signin');
    }
  };

  return (
    <div className="w-full flex flex-col">
      <Hero 
        onGetStarted={() => onNavigate(isLoggedIn ? 'complaints' : 'signup')} 
        onLearnMore={() => {
          const aboutSection = document.querySelector('.features');
          aboutSection?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
      <Announcements onViewAll={() => onNavigate(isLoggedIn ? 'dashboard' : 'signin')} />
      <Features onFeatureClick={handleFeatureClick} />
      <Stats />
      <About />
      <Contact />
      <EmergencyFab onClick={handleEmergencyClick} />
    </div>
  );
}
