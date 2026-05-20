import Link from 'next/link';
import IntersectionReveal from '@/components/IntersectionReveal';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'About Dr. Fr. Roby Kannanchira CMI | Mission & Journey',
  description:
    'Explore the life, spiritual journey, and academic excellence of Dr. Fr. Roby Kannanchira CMI. A doctorate in Interreligious Dialogue and global peace advocate.',
  alternates: {
    canonical: '/about',
  },
};

export default async function About() {
  const supabase = await createClient();
  const { data: scData } = await supabase.from('site_content').select('content_key, content_value').eq('page', 'about');
  const c: Record<string, string> = Object.fromEntries(
    (scData || []).map((r: any) => [r.content_key, r.content_value])
  );

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'mainEntity': {
        '@type': 'Person',
        'name': 'Dr. Fr. Roby Kannanchira CMI',
        'description':
          'Carmelite priest, theologian, and international NGO representative at the United Nations.',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://frrobykannanchiracmi.com/',
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'About',
          'item': 'https://frrobykannanchiracmi.com/about',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': "What is Dr. Fr. Roby Kannanchira CMI's role at the United Nations?",
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              "Dr. Fr. Roby Kannanchira CMI serves as an official NGO Representative at the United Nations in New York, Geneva, and Vienna. He represents CMI's global efforts, advocating for civil society, human rights, sustainable development, and global peace initiatives.",
          },
        },
        {
          '@type': 'Question',
          'name': "What is the Chavara Cultural Centre under Dr. Fr. Roby's leadership?",
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              "Under his leadership as Director, the Chavara Cultural Centre in Delhi has transformed into a vibrant interfaith hub. The center organizes interreligious dialogue programmes, cultural integration festivals, peace education initiatives, and social empowerment projects.",
          },
        },
        {
          '@type': 'Question',
          'name': 'What is the CMI Congregation, and how does it influence his mission?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              "The Carmelites of Mary Immaculate (CMI) is India's first indigenous Catholic religious congregation, founded by Saint Kuriakose Elias Chavara. CMI focuses on education, social reform, and spiritual growth, which serves as the core foundation for Dr. Fr. Roby's lifelong dedication to interfaith and community service.",
          },
        },
        {
          '@type': 'Question',
          'name': 'What doctoral research has Dr. Fr. Roby conducted?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              "Dr. Fr. Roby Kannanchira CMI holds a Doctorate in Theology with a specialized focus on Interreligious Dialogue. His research explores pathways for peace, interfaith cooperation, and cross-cultural encounter, laying the academic foundation for his local and global activities.",
          },
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <IntersectionReveal>
        {/* ─── PAGE HEADER ─── */}
        <div className="page-header" id="main-content">
          <div className="container">
            <p className="breadcrumb">
              <Link href="/">Home</Link> <span>/</span> About
            </p>
            <h1>{c['about_page_title'] || 'About Fr. Roby'}</h1>
            <p>
              {c['about_page_subtitle'] || 'A visionary Carmelite priest dedicated to building a more peaceful and harmonious world through faith, culture, and dialogue.'}
            </p>
          </div>
        </div>

        {/* ─── INTRO ─── */}
        <section className="section">
          <div className="container">
            <div className="grid-2">
              <div className="about-portrait fade-up">
                <img
                  src={c['about_image'] || '/assets/images/frroby-about.webp'}
                  srcSet={`${c['about_image_mobile'] || '/assets/images/frroby-about-mobile.webp'} 600w, ${c['about_image'] || '/assets/images/frroby-about.webp'} 1000w`}
                  sizes="(max-width: 768px) 100vw, 450px"
                  alt="Dr. Fr. Roby Kannanchira CMI Profile Portrait"
                  loading="lazy"
                  width="1000"
                  height="990"
                />
              </div>
              <div className="fade-up">
                <span className="section-label">Introduction</span>
                <h2 className="section-title">
                  Welcome to the Official Website of
                  <br />
                  <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>
                    Dr. Fr. Roby Kannanchira CMI
                  </em>
                </h2>
                <p style={{ marginBottom: '1.25rem' }}>
                  {c['about_intro_text_1'] || 'Dr. Fr. Roby Kannanchira CMI is a visionary leader, scholar, and spiritual guide dedicated to promoting interfaith harmony, cultural preservation, and social empowerment. As Director of the Chavara Cultural Centre, Delhi, and an active NGO Representative at the United Nations, his efforts have touched lives across the globe.'}
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                  {c['about_intro_text_2'] || "Born and raised in Kerala, India, Fr. Roby brought the rich spiritual heritage of the Carmelites of Mary Immaculate (CMI) to bear on the pressing challenges of inter-religious dialogue and cultural understanding in contemporary India and beyond."}
                </p>
                <div className="highlight-box">
                  {c['about_intro_quote'] || '"Every tradition carries within it seeds of peace. Our task is to nurture those seeds together \u2014 across all boundaries of faith and culture."'}
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                  <Link href="/contact" className="btn btn-primary">
                    Get in Touch
                  </Link>
                  <Link href="/initiatives" className="btn btn-navy">
                    View Initiatives
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── BIOGRAPHY ─── */}
        <section className="section section-alt">
          <div className="container">
            <div className="text-center fade-up">
              <span className="section-label">His Journey</span>
              <h2 className="section-title">Life &amp; Mission</h2>
            </div>
            <div className="grid-2" style={{ alignItems: 'start', gap: '4rem' }}>
              <div className="fade-up">
                <p style={{ marginBottom: '1.25rem' }}>
                  {c['about_bio_text_1'] || "Fr. Roby Kannanchira CMI is a priest of the Carmelites of Mary Immaculate (CMI), one of India's first indigenous Catholic religious congregations founded by Blessed Kuriakose Elias Chavara. He has served the Church and society in multiple capacities \u2014 as a theologian, educator, cultural activist, and international advocate."}
                </p>
                <p style={{ marginBottom: '1.25rem' }}>
                  {c['about_bio_text_2'] || 'A Doctorate in Theology specializing in Interreligious Dialogue, his academic work has been widely recognized in theological circles. He has lectured at universities and conferences around the world, sharing insights on peace, dialogue, and the spirituality of encounter.'}
                </p>
                <p>
                  {c['about_bio_text_3'] || 'As Director of the Chavara Cultural Centre in Delhi, Fr. Roby transforms the centre into a vibrant meeting place for arts, culture, spirituality, and interfaith encounter. Under his leadership, the Centre has organized hundreds of programmes bringing together people of diverse faiths and backgrounds.'}
                </p>
              </div>
              <div className="fade-up">
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-date">Early Formation</div>
                    <h4>CMI Religious Formation</h4>
                    <p>
                      Trained in the rich tradition of the Carmelites of Mary Immaculate, foundation
                      of a life dedicated to God and service.
                    </p>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-date">Academic Excellence</div>
                    <h4>Doctorate in Theology</h4>
                    <p>
                      Earned doctoral degree with focus on Interreligious Dialogue — academic
                      foundation for his peace-building work.
                    </p>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-date">Leadership</div>
                    <h4>Director, Chavara Cultural Centre</h4>
                    <p>
                      Appointed Director of the Chavara Cultural Centre in Delhi, transforming it
                      into a hub of culture and interfaith dialogue.
                    </p>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-date">2012</div>
                    <h4>Stallin International Award</h4>
                    <p>
                      Received the prestigious Stallin International Award for Peace and Harmony,
                      Kochi.
                    </p>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-date">2023</div>
                    <h4>International Peace Award, Taiwan</h4>
                    <p>
                      Honored with the Award for International Peace and Harmony at global summit in
                      Taiwan.
                    </p>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-date">Ongoing</div>
                    <h4>UN NGO Representative</h4>
                    <p>
                      Continues to represent civil society at the United Nations, advocating for
                      peace, human rights, and sustainable development.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── NOTABLE VISITORS ─── */}
        <section className="section">
          <div className="container">
            <div className="text-center fade-up">
              <span className="section-label">Distinguished Guests</span>
              <h2 className="section-title">Notable Personalities He Has Met</h2>
              <p className="section-desc">
                Fr. Roby's work has brought him into dialogue with world leaders, spiritual figures,
                and cultural luminaries.
              </p>
            </div>
            <div className="grid-3 fade-up" style={{ gap: '1.5rem' }}>
              <div className="feature-card" style={{ textAlign: 'center' }}>
                <div className="feature-icon" style={{ margin: '0 auto 1rem' }}>
                  🏛️
                </div>
                <h3>President Ananda Bose</h3>
                <p>
                  Governor of West Bengal — discussions on culture, interfaith relations, and
                  national harmony.
                </p>
              </div>
              <div className="feature-card" style={{ textAlign: 'center' }}>
                <div className="feature-icon" style={{ margin: '0 auto 1rem' }}>
                  ✝️
                </div>
                <h3>Apostolic Nuncio</h3>
                <p>
                  Vatican's representative in India — coordination on Catholic outreach and
                  interreligious initiatives.
                </p>
              </div>
              <div className="feature-card" style={{ textAlign: 'center' }}>
                <div className="feature-icon" style={{ margin: '0 auto 1rem' }}>
                  🎭
                </div>
                <h3>Mallika Sarabhai</h3>
                <p>
                  Renowned dancer and cultural activist — collaboration on arts-based
                  peace-building programmes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FAQ SECTION ─── */}
        <section className="section faq-section" style={{ backgroundColor: 'var(--white)' }}>
          <div className="container">
            <div className="text-center fade-up">
              <span className="section-label">Questions</span>
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-desc">
                Learn more about Dr. Fr. Roby Kannanchira CMI's global mission, peace work, and
                affiliations.
              </p>
            </div>
            <div
              className="faq-grid"
              style={{
                maxWidth: '800px',
                margin: '3rem auto 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
              }}
            >
              <div className="faq-item" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                <h3
                  style={{
                    fontSize: '1.15rem',
                    color: 'var(--text)',
                    marginBottom: '0.5rem',
                    fontFamily: 'var(--font-playfair)',
                  }}
                >
                  What is Dr. Fr. Roby Kannanchira CMI's role at the United Nations?
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  Dr. Fr. Roby Kannanchira CMI serves as an official NGO Representative at the United
                  Nations in New York, Geneva, and Vienna. He represents CMI's global efforts,
                  advocating for civil society, human rights, sustainable development, and global
                  peace initiatives.
                </p>
              </div>
              <div className="faq-item" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                <h3
                  style={{
                    fontSize: '1.15rem',
                    color: 'var(--text)',
                    marginBottom: '0.5rem',
                    fontFamily: 'var(--font-playfair)',
                  }}
                >
                  What is the Chavara Cultural Centre under Dr. Fr. Roby's leadership?
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  Under his leadership as Director, the Chavara Cultural Centre in Delhi has
                  transformed into a vibrant interfaith hub. The center organizes interreligious
                  dialogue programmes, cultural integration festivals, peace education initiatives,
                  and social empowerment projects.
                </p>
              </div>
              <div className="faq-item" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                <h3
                  style={{
                    fontSize: '1.15rem',
                    color: 'var(--text)',
                    marginBottom: '0.5rem',
                    fontFamily: 'var(--font-playfair)',
                  }}
                >
                  What is the CMI Congregation, and how does it influence his mission?
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  The Carmelites of Mary Immaculate (CMI) is India's first indigenous Catholic
                  religious congregation, founded by Saint Kuriakose Elias Chavara. CMI focuses on
                  education, social reform, and spiritual growth, which serves as the core foundation
                  for Dr. Fr. Roby's lifelong dedication to interfaith and community service.
                </p>
              </div>
              <div className="faq-item" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                <h3
                  style={{
                    fontSize: '1.15rem',
                    color: 'var(--text)',
                    marginBottom: '0.5rem',
                    fontFamily: 'var(--font-playfair)',
                  }}
                >
                  What doctoral research has Dr. Fr. Roby conducted?
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  Dr. Fr. Roby Kannanchira CMI holds a Doctorate in Theology with a specialized focus
                  on Interreligious Dialogue. His research explores pathways for peace, interfaith
                  cooperation, and cross-cultural encounter, laying the academic foundation for his
                  local and global activities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CONTACT CTA ─── */}
        <section
          className="section quote-section"
          style={{
            background: 'linear-gradient(135deg, var(--blue-dark) 0%, var(--blue) 100%)',
            color: 'var(--white)',
          }}
        >
          <div className="container text-center">
            <span className="section-label" style={{ color: 'var(--gold-light)' }}>
              Work Together
            </span>
            <h2 style={{ color: 'var(--white)', margin: '0.75rem 0' }}>Interested in Collaborating?</h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '2rem',
                maxWidth: '500px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              If you would like to invite Fr. Roby for lectures, interfaith programs, or cultural
              events, please reach out.
            </p>
            <Link href="/contact" className="btn btn-primary" style={{ boxShadow: 'none' }}>
              Contact Fr. Roby →
            </Link>
          </div>
        </section>
      </IntersectionReveal>
    </>
  );
}
