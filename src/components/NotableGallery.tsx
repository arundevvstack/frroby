'use client';

import React, { useState, useEffect, useCallback } from 'react';

const NOTABLE_IMAGES = [
  { src: "https://static.wixstatic.com/media/baf7e1_d106af4a59a742d686ca8b6c0ba7d726~mv2.jpg", alt: "Meeting with Prime Minister Narendra Modi" },
  { src: "https://static.wixstatic.com/media/baf7e1_9c58c625497b485ea34e7adda503f910~mv2.jpg", alt: "Meeting with HE Cardinal George Jacob Koovakad" },
  { src: "https://static.wixstatic.com/media/baf7e1_cd90fcbcf9b9463fae51ccb9bea8c315~mv2.jpg", alt: "Meeting with Hon'ble Vice President Shri. C. P. Radhakrishnan" },
  { src: "https://static.wixstatic.com/media/baf7e1_f057e31ad132438c967b53e88ebe137e~mv2.jpg", alt: "Meeting with Hon'ble Governor of West Bengal Dr. C. V. Ananda Bose" },
];

export default function NotableGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const slideNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % NOTABLE_IMAGES.length);
    }
  }, [lightboxIndex]);

  const slidePrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + NOTABLE_IMAGES.length) % NOTABLE_IMAGES.length);
    }
  }, [lightboxIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') slideNext();
      if (e.key === 'ArrowLeft') slidePrev();
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, slideNext, slidePrev]);

  return (
    <>
      <div className="gallery-grid fade-up" style={{ marginTop: '2rem' }}>
        {NOTABLE_IMAGES.map((img, index) => (
          <div 
            className="gallery-item" 
            key={index} 
            style={{ cursor: 'pointer' }}
            onClick={() => setLightboxIndex(index)}
          >
            <img src={img.src} alt={img.alt} loading="lazy" width="800" height="600" style={{ objectFit: 'cover' }} />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div className="lightbox open" id="lightbox" onClick={() => setLightboxIndex(null)}>
          <button className="lightbox-close" id="lbClose" onClick={e => { e.stopPropagation(); setLightboxIndex(null); }}>✕</button>
          
          <button className="lightbox-nav prev" onClick={e => { e.stopPropagation(); slidePrev(); }} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', fontSize: '2rem', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>‹</button>
          <button className="lightbox-nav next" onClick={e => { e.stopPropagation(); slideNext(); }} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', fontSize: '2rem', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>›</button>
          
          <img src={NOTABLE_IMAGES[lightboxIndex].src} alt="Gallery image" onClick={e => e.stopPropagation()} style={{ userSelect: 'none' }} />
        </div>
      )}
    </>
  );
}
