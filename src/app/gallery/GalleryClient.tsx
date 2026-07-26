'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import IntersectionReveal from '@/components/IntersectionReveal';
import LiveText from '@/components/LiveText';

type GalleryItem = {
  id: string;
  title: string;
  caption?: string;
  image_url: string;
  category: string;
};

const STATIC_ITEMS: GalleryItem[] = [
  { id: 'new1', title: 'Meeting with Prime Minister Narendra Modi', image_url: 'https://static.wixstatic.com/media/baf7e1_d106af4a59a742d686ca8b6c0ba7d726~mv2.jpg', category: 'international' },
  { id: 'new2', title: 'Meeting with HE Cardinal George Jacob Koovakad', image_url: 'https://static.wixstatic.com/media/baf7e1_9c58c625497b485ea34e7adda503f910~mv2.jpg', category: 'international' },
  { id: 'new3', title: "Meeting with Hon'ble Vice President Shri. C. P. Radhakrishnan", image_url: 'https://static.wixstatic.com/media/baf7e1_cd90fcbcf9b9463fae51ccb9bea8c315~mv2.jpg', category: 'events' },
  { id: 'new4', title: "Meeting with Hon'ble Governor of West Bengal Dr. C. V. Ananda Bose", image_url: 'https://static.wixstatic.com/media/baf7e1_f057e31ad132438c967b53e88ebe137e~mv2.jpg', category: 'events' },
  { id: 's1', title: 'National cultural festival event', image_url: '/assets/images/gallery-1.webp', category: 'events' },
  { id: 's2', title: 'Interfaith award ceremony', image_url: '/assets/images/gallery-2.webp', category: 'events' },
  { id: 's3', title: 'Global interfaith dialogue gathering', image_url: '/assets/images/contrib-1.webp', category: 'events' },
  { id: 's4', title: 'Community development program in Delhi', image_url: '/assets/images/contrib-2.webp', category: 'events' },
  { id: 's7', title: 'Fr. Roby receiving International Peace Award in Taiwan', image_url: '/assets/images/award-taiwan-2023.webp', category: 'awards' },
  { id: 's8', title: 'Stallin International Award for Global Peace', image_url: '/assets/images/award-stallin-2012.webp', category: 'awards' },
  { id: 's9', title: 'Fr. Roby at the United Nations General Assembly', image_url: '/assets/images/ngo-united-nations.webp', category: 'international' },
  { id: 's11', title: 'Indo-Rwandan Cultural Night Celebration', image_url: '/assets/images/news-1.webp', category: 'international' },
  { id: 's12', title: 'Vatican delegation and memorial event', image_url: '/assets/images/news-3.webp', category: 'international' },
  { id: 's13', title: 'Theological research presentation', image_url: '/assets/images/research-1.webp', category: 'community' },
  { id: 's14', title: 'Cultural studies research workshop', image_url: '/assets/images/research-2.webp', category: 'community' },
  { id: 's15', title: 'Academic publication and dialogue', image_url: '/assets/images/research-3.webp', category: 'community' },
  { id: 's16', title: 'Social empowerment through academic outreach', image_url: '/assets/images/research-4.webp', category: 'community' },
  { id: 's17', title: 'Collaborative peace building research', image_url: '/assets/images/contrib-3.webp', category: 'community' },
  { id: 's18', title: 'Youth community initiative meeting', image_url: '/assets/images/contrib-4.webp', category: 'community' },
];

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'events', label: 'Events' },
  { id: 'awards', label: 'Awards' },
  { id: 'international', label: 'International' },
  { id: 'community', label: 'Community' },
];

export default function GalleryClient({ dbItems, content = {} }: { dbItems: GalleryItem[], content?: Record<string, string> }) {
  const items = dbItems.length > 0 ? dbItems : STATIC_ITEMS;
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeFilter === 'all' ? items : items.filter(i => i.category === activeFilter);

  const slideNext = useCallback(() => {
    if (lightboxIndex !== null && filtered.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % filtered.length);
    }
  }, [lightboxIndex, filtered.length]);

  const slidePrev = useCallback(() => {
    if (lightboxIndex !== null && filtered.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
    }
  }, [lightboxIndex, filtered.length]);

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

  // Reset lightbox when changing filter so it doesn't break
  useEffect(() => {
    setLightboxIndex(null);
  }, [activeFilter]);

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'ImageGallery', name: 'Dr. Fr. Roby Kannanchira CMI Photo Gallery', description: 'Visual collection of peace summits, cultural events, awards, and interfaith gatherings.' },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://frrobykannanchiracmi.com/' }, { '@type': 'ListItem', position: 2, name: 'Gallery', item: 'https://frrobykannanchiracmi.com/gallery' }] },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": jsonLd }) }} />

      <style dangerouslySetInnerHTML={{ __html: `
        .filter-bar { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
        .filter-btn {
          padding: 7px 20px; border-radius: 50px; font-family: 'Poppins', sans-serif;
          font-size: 0.8rem; font-weight: 600; cursor: pointer;
          border: 1px solid var(--border); background: var(--white);
          color: var(--text-muted); transition: all 0.2s ease;
        }
        .filter-btn:hover, .filter-btn.active { background: var(--gold); border-color: var(--gold); color: var(--navy); }
      `}} />

      <IntersectionReveal>
        <div className="page-header" id="main-content">
          <div className="container">
            <p className="breadcrumb"><Link href="/">Home</Link> <span>/</span> Gallery</p>
            <h1><LiveText contentKey="gallery_page_title" initialValue={content['gallery_page_title'] || 'Photo Gallery'} /></h1>
            <p><LiveText contentKey="gallery_page_desc" initialValue={content['gallery_page_desc'] || "A visual journey through Fr. Roby's work — cultural celebrations, interfaith gatherings, awards, and international summits."} tagName="span" /></p>
          </div>
        </div>

        <section className="section">
          <div className="container">
            <div className="filter-bar">
              {FILTERS.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-btn ${activeFilter === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveFilter(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="gallery-grid">
              {filtered.map((item, index) => (
                <div
                  key={item.id}
                  className="gallery-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setLightboxIndex(index)}
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading={index < 6 ? 'eager' : 'lazy'}
                    width="800"
                    height="600"
                  />
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
                No photos found in this category yet.
              </p>
            )}
          </div>
        </section>
      </IntersectionReveal>

      {lightboxIndex !== null && (
        <div className="lightbox open" id="lightbox" onClick={() => setLightboxIndex(null)}>
          <button className="lightbox-close" id="lbClose" onClick={e => { e.stopPropagation(); setLightboxIndex(null); }}>✕</button>
          
          <button className="lightbox-nav prev" onClick={e => { e.stopPropagation(); slidePrev(); }} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', fontSize: '2rem', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>‹</button>
          <button className="lightbox-nav next" onClick={e => { e.stopPropagation(); slideNext(); }} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', fontSize: '2rem', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>›</button>
          
          <img src={filtered[lightboxIndex]?.image_url} alt="Gallery image" onClick={e => e.stopPropagation()} style={{ userSelect: 'none' }} />
        </div>
      )}
    </>
  );
}
