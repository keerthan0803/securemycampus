import React from 'react';

const DEFAULT_COMMITMENTS = [
  'Zero Tolerance for Harassment',
  'Rapid Response Systems',
  'Data Privacy & Encryption',
];

export default function About({ commitments = DEFAULT_COMMITMENTS }) {
  return (
    <section className="py-3xl bg-surface">
      <div className="container mx-auto px-gutter">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3xl items-center">
          <div className="order-2 lg:order-1">
            <div 
              className="w-full h-[400px] bg-cover bg-center rounded-3xl shadow-xl" 
              style={{ 
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB0JcJqUNAxACiZyChQrI3JqK19gYepQAU8O8_3LiSsQnqF5R8TN0XAHlgfqaY8rLHTBHmubpMh_iBvIxcCzpkwGUIuO7WZ1VXSdsy4nEqwO6Eefzzpl01E6EtmlNiMbjmU9H8nnkn20GF05NSUHcJQewrn5uNrtH1ZhjhiMFVt8MtpK27yV42LHDXhBQnQBhrjUHKSPK8mZj7Kn5t-TR_cjqRx3V3c1FtXouwQX0IgA12hC2XrQKZ7')" 
              }}
              aria-label="A cinematic view of the campus building at sunset"
            ></div>
          </div>
          <div className="order-1 lg:order-2 space-y-lg">
            <h2 className="font-headline-lg text-headline-lg text-primary">Our Mission</h2>
            <p className="font-body-lg text-on-surface-variant leading-relaxed">
              At Secure My Campus, we believe that academic excellence thrives in a safe and secure environment. Our initiative is more than just a reporting tool; it's a commitment to every member of our campus family.
            </p>
            <p className="font-body-lg text-on-surface-variant leading-relaxed">
              By leveraging cutting-edge technology and human-centric design, we bridge the gap between reporting and resolution. Our team of dedicated security professionals works around the clock to ensure that every concern is addressed with transparency and speed.
            </p>
            <ul className="space-y-md pt-md">
              {commitments.map((commitment, index) => (
                <li key={index} className="flex items-center gap-md font-label-md text-label-md text-on-surface">
                  <span className="material-symbols-outlined text-primary bg-primary/10 p-xs rounded-full select-none">
                    check_circle
                  </span>
                  {commitment}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
