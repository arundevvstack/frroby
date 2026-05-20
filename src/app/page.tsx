import Link from 'next/link';
import IntersectionReveal from '@/components/IntersectionReveal';
import StatsSection from '@/components/StatsSection';
import { createClient } from '@/lib/supabase/server';

const STATIC_AWARDS = [
  { id: 'a1', year: 2023, title: 'International Peace & Harmony Award', description: 'Taiwan – Awarded for outstanding contributions to global peace, interfaith dialogue, and cultural diplomacy.', image_url: '/assets/images/award-taiwan-2023.webp' },
  { id: 'a2', year: 2012, title: 'Stallin International Award for Peace & Harmony', description: 'Kochi – Recognizing exemplary leadership in promoting communal harmony and peaceful coexistence in India.', image_url: '/assets/images/award-stallin-2012.webp' },
  { id: 'a3', year: 0, title: 'NGO Representative at the United Nations', description: 'Serving as an official NGO representative, Fr. Roby advocates for human rights, peace, and social justice at the global level.', image_url: '/assets/images/ngo-united-nations.webp' },
];

const STATIC_EVENTS = [
  { id: 'e1', title: 'ART FOR PEACE: Indo–Rwandan Cultural Night, New Delhi', category: 'News · July 2025', description: 'The Art for Peace: Indo–Rwandan Cultural Program was a celebration of harmony through art and diplomacy held in New Delhi.', image_url: '/assets/images/news-1.webp' },
  { id: 'e2', title: 'Global Justice, Love & Peace Summit 2025, Dubai', category: 'News · April 2025', description: 'Rev. Dr. Roby participated as a distinguished speaker at the Global Justice, Love & Peace Summit held in Dubai, April 12–13, 2025.', image_url: '/assets/images/news-2.webp' },
  { id: 'e3', title: 'Condolence Meeting in Honor of His Holiness Pope Francis', category: 'News · May 2025', description: 'A solemn condolence gathering was held in New Delhi to honor the memory of His Holiness Pope Francis.', image_url: '/assets/images/news-3.webp' },
];

export default async function Home() {
  const supabase = await createClient();
  const [{ data: dbAwards }, { data: dbEvents }, { data: scData }] = await Promise.all([
    supabase.from('awards').select('*').order('year', { ascending: false }).limit(3),
    supabase.from('events').select('*').order('event_date', { ascending: false }).limit(3),
    supabase.from('site_content').select('content_key, content_value').eq('page', 'home'),
  ]);
  const awards = dbAwards && dbAwards.length > 0 ? dbAwards : STATIC_AWARDS;
  const events = dbEvents && dbEvents.length > 0 ? dbEvents : STATIC_EVENTS;
  const c: Record<string, string> = Object.fromEntries(
    (scData || []).map((r: any) => [r.content_key, r.content_value])
  );
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': 'https://frrobykannanchiracmi.com/#person',
      'name': 'Dr. Fr. Roby Kannanchira CMI',
      'jobTitle': 'Director of Chavara Cultural Centre, UN NGO Representative',
      'description': 'A visionary leader dedicated to promoting interfaith harmony, cultural preservation, and social empowerment globally.',
      'url': 'https://frrobykannanchiracmi.com/',
      'sameAs': [
        'https://facebook.com/frrobycmi',
        'https://twitter.com/frrobycmi'
      ],
      'image': 'https://frrobykannanchiracmi.com/assets/images/frroby-portrait.webp',
      'nationality': 'Indian',
      'gender': 'Male',
      'affiliation': {
        '@type': 'Organization',
        'name': 'Carmelites of Mary Immaculate',
        'alternateName': 'CMI'
      },
      'worksFor': {
        '@type': 'Organization',
        'name': 'Chavara Cultural Centre, Delhi',
        'url': 'https://frrobykannanchiracmi.com/'
      },
      'knowsAbout': ['Interfaith Dialogue', 'Cultural Preservation', 'Global Peace', 'Theology', 'NGO Advocacy']
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://frrobykannanchiracmi.com/#organization',
      'name': 'Chavara Cultural Centre, Delhi',
      'url': 'https://frrobykannanchiracmi.com/',
      'logo': 'https://frrobykannanchiracmi.com/assets/images/logo.webp',
      'description': 'Chavara Cultural Centre is dedicated to promoting peace education, interreligious dialogue, and cultural preservation under the direction of Dr. Fr. Roby Kannanchira CMI.',
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+91 94478 24575',
        'contactType': 'Enquiry',
        'email': 'robykannan@gmail.com'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [{
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://frrobykannanchiracmi.com/'
      }]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      'name': 'Global Justice, Love & Peace Summit 2025',
      'startDate': '2025-04-12',
      'endDate': '2025-04-13',
      'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
      'eventStatus': 'https://schema.org/EventScheduled',
      'location': {
        '@type': 'Place',
        'name': 'Dubai, UAE',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Dubai',
          'addressCountry': 'UAE'
        }
      },
      'description': 'Rev. Dr. Fr. Roby Kannanchira CMI was a distinguished speaker at the Global Justice, Love & Peace Summit in Dubai.',
      'organizer': {
        '@type': 'Organization',
        'name': 'Global Peace Coalition'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      'name': 'ART FOR PEACE: Indo–Rwandan Cultural Night',
      'startDate': '2025-07-15',
      'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
      'eventStatus': 'https://schema.org/EventScheduled',
      'location': {
        '@type': 'Place',
        'name': 'New Delhi, India',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'New Delhi',
          'addressCountry': 'India'
        }
      },
      'description': 'Dr. Fr. Roby Kannanchira CMI spearheaded the Indo-Rwandan Cultural Night in Delhi to foster international peace through cultural diplomacy.',
      'organizer': {
        '@type': 'Organization',
        'name': 'Chavara Cultural Centre'
      }
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <IntersectionReveal>
        {/* ─── HERO ─── */}
        <section className="hero" id="home">
          <div className="hero-bg"></div>
          <div className="hero-pattern"></div>
          <div className="hero-glow"></div>
          <div className="hero-content" id="main-content">
            <div className="hero-text fade-up">
              <div className="hero-badge">{c['hero_badge'] || 'CMI Priest · UN NGO Representative · Cultural Ambassador'}</div>
              <h1>
                {c['hero_title_line1'] || 'Dr. Fr. Roby'}
                <br />
                <em>{c['hero_title_line2'] || 'Kannanchira'}</em> CMI
              </h1>
              <p className="hero-title" style={{ fontWeight: 600, color: 'var(--blue)', marginTop: '-0.5rem', marginBottom: '1.5rem' }}>
                {c['hero_subtitle'] || 'Director, Chavara Cultural Centre, Delhi'}
              </p>
              <p>
                {c['hero_description'] || 'A visionary leader dedicated to promoting interfaith harmony, cultural preservation, and social empowerment. His efforts have touched lives across the globe through faith, dialogue, and compassionate service.'}
              </p>
              <div className="hero-actions">
                <Link href="/about" className="btn btn-primary">
                  Discover His Story →
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className="hero-image-wrap fade-up">
              <div className="hero-image-inner">
                <img
                  src={c['hero_image'] || '/assets/images/frroby-portrait.webp'}
                  srcSet={`${c['hero_image_mobile'] || '/assets/images/frroby-portrait-mobile.webp'} 600w, ${c['hero_image'] || '/assets/images/frroby-portrait.webp'} 943w`}
                  sizes="(max-width: 768px) 100vw, 400px"
                  alt="Dr. Fr. Roby Kannanchira CMI"
                  loading="eager"
                  width="943"
                  height="882"
                />
              </div>
              <div className="hero-image-badge">
                <span className="badge-icon">🌍</span>
                <div className="badge-text">
                  <strong>UN NGO Representative</strong>
                  <span>New York, Geneva &amp; Vienna</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── QUOTE MARQUEE ─── */}
        <div className="quote-section">
          <div className="container">
            <p className="quote-text">{c['quote_text'] || '"Peace Begins When We Start Celebrating the Other."'}</p>
            <p className="quote-author">{c['quote_author'] || '— Dr. Fr. Roby Kannanchira CMI'}</p>
          </div>
        </div>

        {/* ─── WHAT HE DOES ─── */}
        <section className="section">
          <div className="container">
            <div className="text-center fade-up">
              <span className="section-label">Areas of Impact</span>
              <h2 className="section-title">A Life Devoted to Service &amp; Dialogue</h2>
              <p className="section-desc">
                Fr. Roby bridges communities through faith, culture, education, and international advocacy
                across India and the world.
              </p>
            </div>
            <div className="grid-3 fade-up">
              <div className="feature-card">
                <div className="feature-icon">🌐</div>
                <h3>Global Advocate</h3>
                <p>
                  Championing peace, justice, and equality worldwide as an NGO Representative at the
                  United Nations, participating in key international summits and forums.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🤝</div>
                <h3>Community Builder</h3>
                <p>
                  Empowering marginalized communities through education, cultural outreach, and
                  interreligious dialogue programmes across India and abroad.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">☮️</div>
                <h3>Cultural Ambassador</h3>
                <p>
                  Promoting India's rich cultural heritage and fostering social harmony through art,
                  music, and collaborative cultural programmes.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📚</div>
                <h3>Scholar &amp; Author</h3>
                <p>
                  Author of doctoral research on interfaith relations. Theological educator with deep
                  academic expertise in interreligious dialogue.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🕊️</div>
                <h3>Peace Educator</h3>
                <p>
                  Hosting peace education sessions in schools, universities, and institutions —
                  nurturing the next generation of compassionate leaders.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎭</div>
                <h3>Arts &amp; Culture Director</h3>
                <p>
                  Leading the Chavara Cultural Centre in Delhi as a vibrant hub for artistic
                  expression, cultural exchange, and community celebration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <StatsSection />

        {/* ─── TWO-COL: BUILDING BRIDGES ─── */}
        <section className="section section-alt">
          <div className="container">
            <div className="grid-2">
              <div className="fade-up">
                <span className="section-label">{c['philosophy_label'] || 'His Philosophy'}</span>
                <h2 className="section-title">{c['philosophy_title'] || 'Building Bridges, Not Walls'}</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                  {c['philosophy_description'] || 'The world today needs fewer barriers and more bridges. As people of faith, youth, and leaders — our mission must be to connect, not divide.'}
                </p>
                <ul className="values-list">
                  <li>
                    <div className="v-icon">✦</div>
                    <div>
                      <strong>{c['philosophy_value_1_title'] || 'Replace suspicion with trust'}</strong>
                      <span>{c['philosophy_value_1_desc'] || 'Fostering genuine understanding between different faith communities'}</span>
                    </div>
                  </li>
                  <li>
                    <div className="v-icon">✦</div>
                    <div>
                      <strong>{c['philosophy_value_2_title'] || 'Replace hostility with dialogue'}</strong>
                      <span>{c['philosophy_value_2_desc'] || 'Creating safe spaces for honest, respectful interfaith conversation'}</span>
                    </div>
                  </li>
                  <li>
                    <div className="v-icon">✦</div>
                    <div>
                      <strong>{c['philosophy_value_3_title'] || 'Replace ignorance with understanding'}</strong>
                      <span>{c['philosophy_value_3_desc'] || 'Education and cultural immersion as tools for lasting peace'}</span>
                    </div>
                  </li>
                  <li>
                    <div className="v-icon">✦</div>
                    <div>
                      <strong>{c['philosophy_value_4_title'] || 'Celebrate diversity'}</strong>
                      <span>{c['philosophy_value_4_desc'] || 'Honoring every faith, every life, and every voice as sacred'}</span>
                    </div>
                  </li>
                </ul>
                <br />
                <Link href="/about" className="btn btn-navy">
                  Read His Full Story
                </Link>
              </div>
              <div className="fade-up">
                <img
                  src={c['philosophy_image'] || '/assets/images/building-bridges.webp'}
                  srcSet={`${c['philosophy_image_mobile'] || '/assets/images/building-bridges-mobile.webp'} 800w, ${c['philosophy_image'] || '/assets/images/building-bridges.webp'} 1004w`}
                  sizes="(max-width: 768px) 100vw, 500px"
                  alt="Dr. Fr. Roby at an international interfaith summit"
                  loading="lazy"
                  width="1004"
                  height="533"
                  style={{ borderRadius: '16px', boxShadow: '0 12px 40px rgba(26,39,68,0.15)' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── AWARDS ─── */}
        <section className="section">
          <div className="container">
            <div className="text-center fade-up">
              <span className="section-label">Honours</span>
              <h2 className="section-title">Awards &amp; Recognitions</h2>
              <p className="section-desc">
                National &amp; International Honors recognizing decades of dedicated service to peace and
                harmony.
              </p>
            </div>
            <div className="grid-3 fade-up">
              {awards.map((award: any) => (
                <div key={award.id} className="award-card">
                  {award.image_url && (
                    <img src={award.image_url} alt={award.title} loading="lazy" width="1600" height="864" />
                  )}
                  <div className="award-card-body">
                    <div className="tag tag-gold" style={{ marginBottom: '0.5rem' }}>
                      {award.year && award.year > 0 ? award.year : 'Recognition'}
                    </div>
                    <h3>{award.title}</h3>
                    <p>{award.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center" style={{ marginTop: '2.5rem' }}>
              <Link href="/initiatives" className="btn btn-navy">
                View All Initiatives
              </Link>
            </div>
          </div>
        </section>

        {/* ─── THESIS/RESEARCH ─── */}
        <section className="section section-alt">
          <div className="container">
            <div className="text-center fade-up">
              <span className="section-label">Academia</span>
              <h2 className="section-title">Thesis &amp; Research</h2>
            </div>
            <div className="grid-4 fade-up">
              <div className="award-card">
                <img
                  src="/assets/images/research-1.webp"
                  alt="Fr. Roby presenting research at an interfaith dialogue seminar"
                  loading="lazy"
                  width="1600"
                  height="864"
                />
                <div className="award-card-body">
                  <h3 style={{ fontSize: '0.9rem' }}>Interfaith Dialogue Research</h3>
                </div>
              </div>
              <div className="award-card">
                <img
                  src="/assets/images/research-2.webp"
                  alt="Academic research and cultural studies session"
                  loading="lazy"
                  width="1600"
                  height="864"
                />
                <div className="award-card-body">
                  <h3 style={{ fontSize: '0.9rem' }}>Cultural Studies</h3>
                </div>
              </div>
              <div className="award-card">
                <img
                  src="/assets/images/research-3.webp"
                  alt="Theological studies publication and research paper"
                  loading="lazy"
                  width="1600"
                  height="864"
                />
                <div className="award-card-body">
                  <h3 style={{ fontSize: '0.9rem' }}>Theological Studies</h3>
                </div>
              </div>
              <div className="award-card">
                <img
                  src="/assets/images/research-4.webp"
                  alt="Community empowerment through research and education"
                  loading="lazy"
                  width="1200"
                  height="648"
                />
                <div className="award-card-body">
                  <h3 style={{ fontSize: '0.9rem' }}>Social Empowerment</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── NEWS ─── */}
        <section className="section">
          <div className="container">
            <div className="text-center fade-up">
              <span className="section-label">Latest</span>
              <h2 className="section-title">News &amp; Updates</h2>
            </div>
            <div className="grid-3 fade-up">
              {events.map((evt: any) => (
                <div key={evt.id} className="news-card">
                  {evt.image_url && (
                    <img src={evt.image_url} alt={evt.title} loading="lazy" width="768" height="512" />
                  )}
                  <div className="news-card-body">
                    <p className="news-cat">{evt.category || (evt.event_date ? `News · ${new Date(evt.event_date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}` : 'News')}</p>
                    <h3>{evt.title}</h3>
                    <p>{evt.description}</p>
                  </div>
                  <div className="news-card-footer">By Dr. Fr. Roby Kannanchira CMI</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </IntersectionReveal>
    </>
  );
}
