import React, { useState } from 'react';

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
                    className={`faq-item bg-surface-container-lowest rounded-xl custom-shadow border-l-4 border-transparent hover:border-primary transition-all duration-300 ${isActive ? 'active border-primary' : ''
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
                          className={`rating-star material-symbols-outlined text-3xl cursor-pointer transition-colors border-none bg-transparent p-0 ${isActive ? 'active text-yellow-500' : 'text-outline-variant hover:text-secondary'
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

      </div>
    </div>
  );
}
