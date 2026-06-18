'use client';

import React, { useState } from 'react';
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
  { id: 's1', title: 'National cultural festival event', image_url: '/assets/images/gallery-1.webp', category: 'events' },
  { id: 's2', title: 'Interfaith award ceremony', image_url: '/assets/images/gallery-2.webp', category: 'events' },
  { id: 's3', title: 'Global interfaith dialogue gathering', image_url: '/assets/images/contrib-1.webp', category: 'events' },
  { id: 's4', title: 'Community development program in Delhi', image_url: '/assets/images/contrib-2.webp', category: 'events' },
  { id: 's5', title: 'Peace and harmony community walk', image_url: '/assets/images/gallery-3.webp', category: 'community' },
  { id: 's6', title: 'Cultural yoga and wellness workshop', image_url: '/assets/images/gallery-4.webp', category: 'events' },
  { id: 's7', title: 'Fr. Roby receiving International Peace Award in Taiwan', image_url: '/assets/images/award-taiwan-2023.webp', category: 'awards' },
  { id: 's8', title: 'Stallin International Award for Global Peace', image_url: '/assets/images/award-stallin-2012.webp', category: 'awards' },
  { id: 's9', title: 'Fr. Roby at the United Nations General Assembly', image_url: '/assets/images/ngo-united-nations.webp', category: 'international' },
  { id: 's10', title: 'Peace Summit Speaker Session in Dubai', image_url: '/assets/images/news-2.webp', category: 'international' },
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
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filtered = activeFilter === 'all' ? items : items.filter(i => i.category === activeFilter);

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
                  onClick={() => setLightboxImage(item.image_url)}
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

      {lightboxImage && (
        <div className="lightbox active" id="lightbox" onClick={() => setLightboxImage(null)}>
          <button className="lightbox-close" id="lbClose" onClick={e => { e.stopPropagation(); setLightboxImage(null); }}>✕</button>
          <img src={lightboxImage} alt="Gallery image" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
