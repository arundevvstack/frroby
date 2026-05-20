'use client';

import React, { useEffect, useRef, useState } from 'react';

interface StatItemProps {
  target: number;
  suffix: string;
  label: string;
}

function StatItem({ target, suffix, label }: StatItemProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          let frame = 0;
          const duration = 1500;
          const frameRate = 1000 / 60;
          const totalFrames = Math.round(duration / frameRate);

          const animate = () => {
            frame++;
            const progress = frame / totalFrames;
            const current = Math.round(
              target * (progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress))
            );
            setCount(current);
            if (frame < totalFrames) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [target]);

  return (
    <div className="stat-item fade-up" ref={elementRef}>
      <div className="stat-number">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <div className="stats-section">
      <div className="container">
        <div className="stats-grid">
          <StatItem target={25} suffix="+" label="Years of Service" />
          <div className="stat-divider"></div>
          <StatItem target={40} suffix="+" label="Countries Reached" />
          <div className="stat-divider"></div>
          <StatItem target={12} suffix="+" label="Awards &amp; Recognitions" />
          <div className="stat-divider"></div>
          <StatItem target={500} suffix="+" label="Events Organized" />
        </div>
      </div>
    </div>
  );
}
