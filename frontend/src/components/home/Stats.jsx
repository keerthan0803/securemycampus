import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_STATS = [
  { id: 1, endValue: 0, decimals: 0, suffix: '', label: 'Resolved Issues', key: 'resolvedIssues' },
  { id: 2, endValue: 0, decimals: 0, suffix: '', label: 'Active Users', key: 'activeUsers' },
  { id: 3, endValue: 24, decimals: 0, suffix: '/7', label: 'Security Support', key: 'securitySupport' },
  { id: 4, endValue: 100, decimals: 0, suffix: '%', label: 'Safety Rating', key: 'safetyRating' },
];

const StatCounter = ({ endValue, decimals, suffix, isVisible }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    if (!isVisible) return;

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
  }, [endValue, isVisible]);

  return (
    <div className="font-display-lg text-[56px] font-extrabold">
      {count.toFixed(decimals)}{suffix}
    </div>
  );
};

export default function Stats() {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(prevStats => prevStats.map(stat => ({
            ...stat,
            endValue: data[stat.key] !== undefined ? data[stat.key] : stat.endValue
          })));
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <section ref={sectionRef} className="stats py-3xl bg-primary-container text-on-primary">
      <div className="container mx-auto px-gutter grid grid-cols-2 lg:grid-cols-4 gap-xl text-center">
        {stats.map((stat) => (
          <div key={stat.id} className="space-y-sm">
            <StatCounter endValue={stat.endValue} decimals={stat.decimals} suffix={stat.suffix} isVisible={isVisible} />
            <div className="font-label-md text-label-md uppercase tracking-widest opacity-80">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
