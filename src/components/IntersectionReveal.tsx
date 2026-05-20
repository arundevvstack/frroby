'use client';

import React, { useEffect, useRef } from 'react';

interface IntersectionRevealProps {
  children: React.ReactNode;
}

export default function IntersectionReveal({ children }: IntersectionRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.fade-up');
      elements.forEach((el) => observer.observe(el));
    }

    return () => {
      observer.disconnect();
    };
  }, [children]);

  return <div ref={containerRef}>{children}</div>;
}
