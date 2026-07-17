import React from 'react';

const DEFAULT_CONTACTS = [
  {
    id: 'phone',
    icon: 'call',
    label: 'Emergency Phone',
    value: '+91 040 1234 5678',
  },
  {
    id: 'email',
    icon: 'mail',
    label: 'General Inquiries',
    value: 'security@securemycampus.edu',
  },
];

const DEFAULT_HOTLINES = [
  { label: 'Main Desk', value: 'ext. 404' },
  { label: 'Medical', value: 'ext. 911' },
];

export default function Contact({ 
  contacts = DEFAULT_CONTACTS, 
  hotlines = DEFAULT_HOTLINES 
}) {
  return (
    <section className="contact py-3xl bg-surface-container-low border-t border-outline-variant/30">
      <div className="container mx-auto px-gutter">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-2xl">
          <div className="max-w-md w-full">
            <h2 className="font-headline-md text-headline-md text-primary mb-md">Contact Campus Security</h2>
            <p className="font-body-md text-on-surface-variant mb-xl">
              Available 24/7 for emergencies, inquiries, and technical support.
            </p>
            
            <div className="space-y-lg">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center gap-md">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary border border-outline-variant/30 select-none">
                    <span className="material-symbols-outlined">{contact.icon}</span>
                  </div>
                  <div>
                    <p className="font-caption text-caption text-on-surface-variant">{contact.label}</p>
                    <p className="font-label-md text-label-md text-on-surface">{contact.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-1/3">
            <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-lg">Follow Us</h3>
            <div className="flex gap-md social-media">
              <a 
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-outline-variant hover:bg-primary hover:text-white transition-all text-on-surface-variant" 
                href="#"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.324v-21.35c0-.732-.593-1.325-1.323-1.325z"></path>
                </svg>
              </a>
              <a 
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-outline-variant hover:bg-primary hover:text-white transition-all text-on-surface-variant" 
                href="#"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                </svg>
              </a>
              <a 
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-outline-variant hover:bg-primary hover:text-white transition-all text-on-surface-variant" 
                href="#"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"></path>
                </svg>
              </a>
            </div>
            
            <div className="mt-xl p-lg bg-primary/5 rounded-xl border border-primary/10">
              <p className="font-label-md text-label-md text-primary mb-sm">Emergency Hotlines</p>
              {hotlines.map((hotline, index) => (
                <p key={index} className="font-body-md text-on-surface-variant">
                  {hotline.label}: {hotline.value}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
