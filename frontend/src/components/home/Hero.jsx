import React from 'react';

export default function Hero({ onGetStarted, onLearnMore }) {
  return (
    <section className="hero relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Overlay gradient */}
      <div className="absolute inset-0 hero-gradient opacity-90 z-0"></div>

      <div className="container mx-auto px-gutter relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-2xl items-center py-2xl">
        <div className="text-white space-y-lg animate-fade-in">
          <h1 className="font-display-lg text-display-lg leading-tight">
            Ensuring a <span className="text-on-primary-container">Safer Campus</span> for Everyone
          </h1>
          <p className="font-body-lg text-body-lg opacity-90 max-w-xl">
            A centralized, secure, and rapid response platform designed for the students and faculty of Anurag University. Report incidents, track safety, and stay informed with real-time campus updates.
          </p>
          <div className="flex flex-wrap gap-md pt-md">
            <button
              onClick={onGetStarted}
              className="px-xl py-lg bg-surface-container-lowest text-primary font-label-md text-label-md rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-sm cursor-pointer"
            >
              Get Started
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button
              onClick={onLearnMore}
              className="px-xl py-lg border border-white/30 text-white font-label-md text-label-md rounded-xl hover:bg-white/10 transition-all cursor-pointer"
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="relative hidden lg:block group">
          <div className="absolute -inset-4 bg-primary-container rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <img
            alt="Secure My Campus View"
            className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover border-4 border-white/20"
            src="/homepage.jpg"
          />
        </div>
      </div>
    </section>
  );
}
