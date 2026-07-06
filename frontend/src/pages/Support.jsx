import React, { useState } from 'react';
import Card from '../components/ui/Card';

const FAQS = [
  {
    id: 1,
    question: 'How do I report a security incident on campus?',
    answer: 'You can report incidents directly through the "Emergency" button in the Dashboard or by calling the campus security hotline at ext. 5555. Our response team is available 24/7.'
  },
  {
    id: 2,
    question: 'Where can I find the latest campus safety alerts?',
    answer: 'Live alerts are broadcasted through the Notifications center in this portal. We also send SMS alerts to all registered mobile numbers during critical situations.'
  },
  {
    id: 3,
    question: 'Can I request a security escort after hours?',
    answer: 'Yes, the "Safe Walk" service is available from 8:00 PM to 4:00 AM daily. Use the Campus Map section to request an escort to your vehicle or dormitory.'
  },
  {
    id: 4,
    question: 'How do I update my emergency contact information?',
    answer: 'Navigate to the "Settings" menu and select "Security Profile." From there, you can manage your personal emergency contacts and notification preferences.'
  }
];

const TEAM = [
  {
    name: 'Aditya Sharma',
    role: 'Lead Developer',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEBAs-_kfuwbPqM90qRaXTEfamd0I6S_2kOSqReSirXwANT65dDuINhaV8GI_zKU_uVeSuIGAA6OTT3nI3bM1Kh6YxT8I2RUA4pWSftWvcXyx8UfNaj1D-J6Y3WEmP9d27ZyEgKSfSo9czBOXtixxprHxpfUjc9d87ah8APbFfF4kT7RhkTfryMI3sc7lcii5RWGB9MCVHg2Q5s4FfRnQcbxELs4nU2KAlfCpa7Kj-s3srzm9m2BLG',
    icons: ['code', 'terminal']
  },
  {
    name: 'Priya Verma',
    role: 'UI/UX Lead',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8Dw_uEOT2P6sP1p3u3M9M9yJd-1G00QZ-bxgBxWEhTpT9f7VgwpUWAb_kvUcN5QRdvmTQJpU-LbVGjrW_Pa18f6yv3bSej3uz75bSwP1qEb5VQR6uGWDlnZBtqATtekSUlvqDSIgp_76U599l_A3avy5Bwsu8y9tm-NVjMiFOqfggCVe2uunajTORhr9fHwpJsW0rTCG5ArrTSEq2ihWhBmXYzvd7lGZWqdG4v1WLWnbmJMXKEETd',
    icons: ['palette', 'brush']
  },
  {
    name: 'Rahul Reddy',
    role: 'Security Consultant',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0j6lVIWj4oS1KVKUiBiS5dizW3QgbnryTKW9DCoMOig3z3RFstOA53ZAlycEnZsm8EyWIjlqAXPRc3IBMbBKhBZrhBGxiKf49boN4UsMfCCasMgWMb9zjIynfoLtvf-djkBTW1m4mxJ3FxsNT92Vms7du42PEUMWEkAbnZ2EeGal9AYcEX2GRH-3sSMf5BS2g7dzAqYiIrjtPR6eKOx1bQuERNBnUj-gbwtvi-MVEKECDv2NtHS0e',
    icons: ['security', 'lock']
  },
  {
    name: 'Sanya Malhotra',
    role: 'Project Manager',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_Gj9UGfsiKcazq5uAMkSYAFa_Qb4TrTOSID_0mECmX6fW32ny_FzKImlhtAygbPVSmR3Dh7QpS8CEbNZwHoAQa04bs8QM81Xo00qtKrXUvuKL0f_sAx_5i9Yc-WNG0JkbsTipmJDtN9jdKgGbH3BX6A6CuGU3euteKSJDnw4alFQt_QdLgbMtBNxfan8TsMRnD7UaNGnPgudQmdebOlxiFYs07CwcD2m1VqHNUSyVxd7AbXhrhbwi',
    icons: ['groups', 'event_note']
  }
];

export default function Support() {
  const [activeFaq, setActiveFaq] = useState(1); // First FAQ open by default
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  const toggleFaq = (id) => {
    setActiveFaq(prev => (prev === id ? null : id));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }
    alert(`Thank you ${name} for your feedback! We will inspect your request.`);
    
    // Reset Form
    setName('');
    setEmail('');
    setType('General Inquiry');
    setRating(0);
    setMessage('');
  };

  return (
    <div className="w-full min-h-screen pb-3xl">
      <div className="max-w-container-max mx-auto px-gutter space-y-3xl pt-xl">
        
        {/* Hero Section */}
        <section className="text-center space-y-md">
          <h1 className="font-display-lg text-display-lg text-primary">How can we help you today?</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Find answers to common questions about campus safety, security protocols, and student services.
          </p>
        </section>

        {/* FAQs & Feedback Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">
          
          {/* FAQ Section */}
          <section className="lg:col-span-7 faq-section space-y-lg">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-primary select-none">quiz</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-md">
              {FAQS.map((faq) => {
                const isActive = activeFaq === faq.id;
                return (
                  <div 
                    key={faq.id} 
                    className={`faq-item bg-surface-container-lowest rounded-xl custom-shadow border-l-4 border-transparent hover:border-primary transition-all duration-300 ${
                      isActive ? 'active border-primary' : ''
                    }`}
                  >
                    <button 
                      onClick={() => toggleFaq(faq.id)}
                      className="faq-question w-full flex items-center justify-between p-lg text-left focus:outline-none border-none bg-transparent cursor-pointer"
                    >
                      <span className="font-label-md text-label-md text-on-surface">{faq.question}</span>
                      <span className="faq-chevron material-symbols-outlined text-on-surface-variant transition-transform duration-300 select-none">
                        expand_more
                      </span>
                    </button>
                    <div 
                      className="faq-answer px-lg text-on-surface-variant leading-relaxed"
                      style={{ maxHeight: isActive ? '300px' : '0', paddingBottom: isActive ? '24px' : '0' }}
                    >
                      {faq.answer}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Feedback Form Section */}
          <section className="lg:col-span-5">
            <div className="bg-surface-container-lowest rounded-xl custom-shadow p-xl border border-outline-variant/30 lg:sticky lg:top-24">
              <div className="flex items-center gap-sm mb-lg">
                <span className="material-symbols-outlined text-primary select-none">rate_review</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">Send Feedback</h2>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-lg">
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="fullName">
                    Full Name <span className="text-error">*</span>
                  </label>
                  <input 
                    id="fullName"
                    className="w-full p-md bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md" 
                    placeholder="Enter your name" 
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="emailAddr">
                    Email Address <span className="text-error">*</span>
                  </label>
                  <input 
                    id="emailAddr"
                    className="w-full p-md bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md" 
                    placeholder="student@securemycampus.edu" 
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="feedbackType">
                    Feedback Type
                  </label>
                  <select 
                    id="feedbackType"
                    className="w-full p-md bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md cursor-pointer"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Security Concern">Security Concern</option>
                    <option value="App Technical Issue">App Technical Issue</option>
                    <option value="Suggestion">Suggestion</option>
                  </select>
                </div>

                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant">
                    How would you rate our security app?
                  </label>
                  <div className="rating flex gap-xs py-sm select-none">
                    {[1, 2, 3, 4, 5].map((starIdx) => {
                      const isActive = hoverRating !== null ? starIdx <= hoverRating : starIdx <= rating;
                      return (
                        <button
                          key={starIdx}
                          type="button"
                          onClick={() => setRating(starIdx)}
                          onMouseEnter={() => setHoverRating(starIdx)}
                          onMouseLeave={() => setHoverRating(null)}
                          className={`rating-star material-symbols-outlined text-3xl cursor-pointer transition-colors border-none bg-transparent p-0 ${
                            isActive ? 'active text-yellow-500' : 'text-outline-variant hover:text-secondary'
                          }`}
                          aria-label={`Rate ${starIdx} stars`}
                        >
                          star
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="userMsg">
                    Your Message <span className="text-error">*</span>
                  </label>
                  <textarea 
                    id="userMsg"
                    className="w-full p-md bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none font-body-md" 
                    placeholder="How can we improve your experience?" 
                    required
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-md bg-primary text-white font-label-md rounded-lg hover:bg-primary-container transition-all active:scale-95 shadow-md cursor-pointer border-none"
                >
                  Submit Feedback
                </button>
              </form>
            </div>
          </section>
        </div>

        {/* Core Development Team Section */}
        <section className="space-y-xl pt-lg border-t border-outline-variant/30">
          <div className="text-center">
            <h2 className="font-headline-md text-headline-md text-primary">Development Team</h2>
            <p className="font-body-md text-on-surface-variant">Meet the architects behind the Secure Campus Initiative.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
            {TEAM.map((member, idx) => (
              <div 
                key={idx}
                className="bg-surface-container-lowest rounded-xl p-lg custom-shadow custom-shadow-hover transition-all flex flex-col items-center text-center select-none border border-outline-variant/20 hover:-translate-y-1 hover:shadow-md duration-300"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mb-md border-2 border-primary-fixed">
                  <img 
                    className="w-full h-full object-cover" 
                    src={member.avatar} 
                    alt={member.name} 
                  />
                </div>
                <h3 className="font-label-md text-label-md text-primary">{member.name}</h3>
                <p className="font-caption text-caption text-on-surface-variant">{member.role}</p>
                <div className="flex gap-sm mt-md text-primary-fixed-dim select-none">
                  {member.icons.map((ico, iIdx) => (
                    <span key={iIdx} className="material-symbols-outlined text-[20px]">{ico}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
