import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_STATS = [
  { id: 1, endValue: 1.2, decimals: 1, suffix: 'k+', label: 'Resolved Issues' },
  { id: 2, endValue: 15, decimals: 0, suffix: 'k+', label: 'Active Users' },
  { id: 3, endValue: 24, decimals: 0, suffix: '/7', label: 'Security Support' },
  { id: 4, endValue: 98, decimals: 0, suffix: '%', label: 'Safety Rating' },
];

const StatCounter = ({ endValue, decimals, suffix }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    let startTime = null;
    const duration = 2000; // 2 seconds

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(easeProgress * endValue);

      if (progress < 1) {
        countRef.current = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    countRef.current = requestAnimationFrame(animate);

    return () => {
      if (countRef.current) cancelAnimationFrame(countRef.current);
    };
  }, [endValue]);

  return (
    <div className="font-display-lg text-[56px] font-extrabold">
      {count.toFixed(decimals)}{suffix}
    </div>
  );
};

export default function Stats({ stats = DEFAULT_STATS }) {
  return (
    <section className="stats py-3xl bg-primary-container text-on-primary">
      <div className="container mx-auto px-gutter grid grid-cols-2 lg:grid-cols-4 gap-xl text-center">
        {stats.map((stat) => (
          <div key={stat.id} className="space-y-sm">
            <StatCounter endValue={stat.endValue} decimals={stat.decimals} suffix={stat.suffix} />
            <div className="font-label-md text-label-md uppercase tracking-widest opacity-80">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
