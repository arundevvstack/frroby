import Link from 'next/link';
import IntersectionReveal from '@/components/IntersectionReveal';
import LiveText from '@/components/LiveText';
import LiveImage from '@/components/LiveImage';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Initiatives & Contributions | Dr. Fr. Roby Kannanchira CMI',
  description:
    "Discover the impact of Dr. Fr. Roby Kannanchira CMI's initiatives, from the Chavara Cultural Centre's programs to global peace summits and social welfare activities.",
  alternates: { canonical: '/initiatives' },
};

// Static fallback data shown when DB is empty
const STATIC_INITIATIVES = [
  {
    id: 'static-1',
    title: 'Interfaith Dialogue',
    category: 'Flagship',
    description:
      'Organizing regular inter-religious dialogues, seminars, and joint prayer services with Hindu, Muslim, Sikh, Buddhist, Jain, and Christian communities.',
    image_url: '/assets/images/contrib-1.webp',
  },
  {
    id: 'static-2',
    title: 'Arts & Culture',
    category: 'Active',
    description:
      'Promoting classical performing arts, visual arts, film, and literature as tools for cultural understanding and community building.',
    image_url: '/assets/images/contrib-2.webp',
  },
  {
    id: 'static-3',
    title: 'Youth Empowerment',
    category: 'Active',
    description:
      'Leadership training, camps, and workshops for young people to become ambassadors of peace and interreligious understanding.',
    image_url: '/assets/images/contrib-3.webp',
  },
  {
    id: 'static-5',
    title: 'Social Welfare',
    category: 'Active',
    description:
      'Community welfare programmes offering healthcare, educational support, legal awareness, and livelihood assistance to the underprivileged.',
    image_url: '',
  },
  {
    id: 'static-6',
    title: 'Publications & Media',
    category: 'Ongoing',
    description:
      'Academic articles, books, and media productions on interfaith theology, cultural studies, and the spirituality of encounter.',
    image_url: '',
  },
];

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Initiatives() {
  const supabase = await createClient();
  const [{ data: dbInitiatives }, { data: scData }] = await Promise.all([
    supabase.from('initiatives').select('*').order('created_at', { ascending: false }),
    supabase.from('site_content').select('content_key, content_value').eq('page', 'initiatives')
  ]);

  const c: Record<string, string> = Object.fromEntries(
    (scData || []).map((r: any) => [r.content_key, r.content_value])
  );

  const initiatives =
    dbInitiatives && dbInitiatives.length > 0 ? dbInitiatives : STATIC_INITIATIVES;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Initiatives & Contributions',
      description:
        "Details of Dr. Fr. Roby Kannanchira CMI's various social, cultural, and spiritual initiatives globally.",
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://frrobykannanchiracmi.com/' },
        { '@type': 'ListItem', position: 2, name: 'Initiatives', item: 'https://frrobykannanchiracmi.com/initiatives' },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": jsonLd }) }} />

      <IntersectionReveal>
        {/* ─── PAGE HEADER ─── */}
        <div className="page-header" id="main-content">
          <div className="container">
            <p className="breadcrumb">
              <Link href="/">Home</Link> <span>/</span> Initiatives &amp; Contributions
            </p>
            <h1><LiveText contentKey="init_page_title" initialValue={c['init_page_title'] || 'Initiatives & Contributions'} /></h1>
            <p>
              <LiveText contentKey="init_page_desc" initialValue={c['init_page_desc'] || 'Decades of transformative work across faith, culture, education, and international advocacy — touching millions of lives.'} tagName="span" />
            </p>
          </div>
        </div>

        {/* ─── CHAVARA CULTURAL CENTRE ─── */}
        <section className="section">
          <div className="container">
            <div className="grid-2">
              <div className="fade-up">
                <span className="section-label"><LiveText contentKey="init_ccc_label" initialValue={c['init_ccc_label'] || 'Flagship Institution'} /></span>
                <h2 className="section-title"><LiveText contentKey="init_ccc_title" initialValue={c['init_ccc_title'] || 'Chavara Cultural Centre, Delhi'} /></h2>
                <p style={{ marginBottom: '1.25rem' }}>
                  <LiveText contentKey="init_ccc_desc1" initialValue={c['init_ccc_desc1'] || "As the Director of the Chavara Cultural Centre in Delhi, Fr. Roby has transformed it into one of the most vibrant hubs for intercultural and interfaith dialogue in the national capital. Named after Blessed Kuriakose Elias Chavara, the Centre serves as a bridge between Kerala's rich cultural heritage and the diverse communities of Delhi."} tagName="span" />
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                  <LiveText contentKey="init_ccc_desc2" initialValue={c['init_ccc_desc2'] || 'The Centre hosts hundreds of programmes annually — from classical arts performances and literary festivals to interfaith prayer services, youth leadership camps, and community welfare initiatives.'} tagName="span" />
                </p>
                <ul className="values-list">
                  <li>
                    <div className="v-icon">🎭</div>
                    <div>
                      <strong>Cultural Programmes</strong>
                      <span>Classical music, dance, theatre, and arts exhibitions throughout the year</span>
                    </div>
                  </li>
                  <li>
                    <div className="v-icon">🕊️</div>
                    <div>
                      <strong>Interfaith Prayer Services</strong>
                      <span>Regular gatherings bringing together communities across faith traditions</span>
                    </div>
                  </li>
                  <li>
                    <div className="v-icon">🤝</div>
                    <div>
                      <strong>Community Outreach</strong>
                      <span>Educational support, counselling, and welfare for marginalized groups</span>
                    </div>
                  </li>
                  <li>
                    <div className="v-icon">📖</div>
                    <div>
                      <strong>Research &amp; Publications</strong>
                      <span>Academic forums, seminars, and publications on theology and culture</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="fade-up">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <img src="/assets/images/contrib-1.webp" alt="Cultural program at Chavara Centre" loading="lazy" width="1600" height="864" style={{ borderRadius: '12px', height: '200px', objectFit: 'cover', width: '100%' }} />
                  <img src="/assets/images/contrib-2.webp" alt="Interfaith prayer service" loading="lazy" width="1600" height="864" style={{ borderRadius: '12px', height: '200px', objectFit: 'cover', width: '100%' }} />
                  <img src="/assets/images/contrib-3.webp" alt="Community development project" loading="lazy" width="1600" height="864" style={{ borderRadius: '12px', height: '200px', objectFit: 'cover', width: '100%' }} />
                  <img src="/assets/images/contrib-4.webp" alt="Cultural exchange festival" loading="lazy" width="1200" height="648" style={{ borderRadius: '12px', height: '200px', objectFit: 'cover', width: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── DYNAMIC INITIATIVES GRID ─── */}
        <section className="section section-alt">
          <div className="container">
            <div className="text-center fade-up">
              <span className="section-label"><LiveText contentKey="init_areas_label" initialValue={c['init_areas_label'] || 'Areas of Work'} /></span>
              <h2 className="section-title"><LiveText contentKey="init_areas_title" initialValue={c['init_areas_title'] || 'Key Departments & Ministries'} /></h2>
            </div>
            <div className="grid-3 fade-up" id="initiatives-grid">
              {initiatives.map((item: any) => (
                <div key={item.id} className="feature-card">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      loading="lazy"
                      style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                    />
                  )}
                  {!item.image_url && (
                    <div className="feature-icon">💡</div>
                  )}
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.category && (
                    <>
                      <br />
                      <span className="tag tag-navy">{item.category}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── INTERNATIONAL ─── */}
        <section className="section">
          <div className="container">
            <div className="text-center fade-up">
              <span className="section-label"><LiveText contentKey="init_intl_label" initialValue={c['init_intl_label'] || 'International Presence'} /></span>
              <h2 className="section-title"><LiveText contentKey="init_intl_title" initialValue={c['init_intl_title'] || 'Global Initiatives'} /></h2>
            </div>
            <div className="grid-2" style={{ alignItems: 'start', gap: '3rem' }}>
              <div className="fade-up">
                <div className="award-card" style={{ marginBottom: '1.5rem' }}>
                  <img src="/assets/images/award-taiwan-2023.webp" alt="International Peace and Harmony Summit - Taiwan" loading="lazy" width="1600" height="864" />
                  <div className="award-card-body">
                    <div className="tag tag-gold" style={{ marginBottom: '0.5rem' }}>Taiwan · 2023</div>
                    <h3>International Peace &amp; Harmony Summit</h3>
                    <p>Represented India at the International Peace and Harmony Summit in Taiwan, receiving the Award for International Peace and Harmony 2023.</p>
                  </div>
                </div>
                <div className="award-card">
                  <img src="/assets/images/news-1.webp" alt="Indo-Rwandan Cultural Night" loading="lazy" width="768" height="512" />
                  <div className="award-card-body">
                    <div className="tag tag-gold" style={{ marginBottom: '0.5rem' }}>New Delhi · 2025</div>
                    <h3>ART FOR PEACE: Indo–Rwandan Cultural Night</h3>
                    <p>Organized the landmark Indo–Rwandan Cultural Night in New Delhi — a celebration of harmony through art and diplomacy.</p>
                  </div>
                </div>
              </div>
              <div className="fade-up">
                <div className="award-card" style={{ marginBottom: '1.5rem' }}>
                  <img src="/assets/images/news-2.webp" alt="Global Justice Peace Summit - Dubai 2025" loading="lazy" width="768" height="432" />
                  <div className="award-card-body">
                    <div className="tag tag-gold" style={{ marginBottom: '0.5rem' }}>Dubai · April 2025</div>
                    <h3>Global Justice, Love &amp; Peace Summit</h3>
                    <p>Distinguished speaker at the Global Justice, Love &amp; Peace Summit 2025 in Dubai, sharing insights on faith-based peace-building.</p>
                  </div>
                </div>
                <div className="award-card">
                  <img src="/assets/images/award-stallin-2012.webp" alt="Stallin International Award" loading="lazy" width="1600" height="864" />
                  <div className="award-card-body">
                    <div className="tag tag-gold" style={{ marginBottom: '0.5rem' }}>Kochi · 2012</div>
                    <h3>Stallin International Award for Peace</h3>
                    <p>Received the prestigious Stallin International Award for Peace and Harmony in Kochi — recognition of his pioneering work in communal harmony.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── NGO AT UN ─── */}
        <section className="section quote-section" style={{ background: 'linear-gradient(135deg, var(--blue-dark) 0%, var(--blue) 100%)', color: 'var(--white)' }}>
          <div className="container">
            <div className="grid-2" style={{ alignItems: 'center', gap: '3rem' }}>
              <div className="fade-up text-center">
                <p className="quote-text" style={{ fontSize: '1.4rem' }}>
                  <LiveText contentKey="init_un_quote" initialValue={c['init_un_quote'] || '"At the United Nations, every voice counts. Fr. Roby ensures that the voice of India\'s interfaith communities is heard loudly and clearly."'} />
                </p>
              </div>
              <div className="fade-up">
                <span className="section-label" style={{ color: 'var(--gold-light)' }}><LiveText contentKey="init_un_label" initialValue={c['init_un_label'] || 'United Nations Role'} /></span>
                <h2 style={{ color: 'var(--white)', marginBottom: '1rem' }}><LiveText contentKey="init_un_title" initialValue={c['init_un_title'] || 'NGO Representative at the UN'} /></h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' }}>
                  <LiveText contentKey="init_un_desc" initialValue={c['init_un_desc'] || 'Fr. Roby participates in United Nations sessions in New York, Geneva, and Vienna. He advocates for peace, human rights, and the rights of religious minorities on behalf of civil society organizations.'} tagName="span" />
                </p>
                <img
                  src="/assets/images/ngo-united-nations.webp"
                  alt="Dr. Fr. Roby at the United Nations"
                  loading="lazy"
                  width="1600"
                  height="864"
                  style={{ borderRadius: '12px', maxHeight: '260px', width: '100%', objectFit: 'cover', border: '2px solid rgba(201,168,76,0.25)' }}
                />
              </div>
            </div>
          </div>
        </section>
      </IntersectionReveal>
    </>
  );
}
