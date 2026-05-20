import Link from 'next/link';
import IntersectionReveal from '@/components/IntersectionReveal';

export const metadata = {
  title: 'Associations & Collaborations | Dr. Fr. Roby Kannanchira CMI',
  description:
    "Explore Dr. Fr. Roby Kannanchira CMI's global network, including his work with the United Nations and other international interfaith and cultural institutions.",
  alternates: {
    canonical: '/associations',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Associations() {
  const supabase = await createClient();
  const [{ data: dbAssociations }, { data: scData }] = await Promise.all([
    supabase.from('associations').select('*').order('created_at', { ascending: false }),
    supabase.from('site_content').select('content_key, content_value').eq('page', 'associations')
  ]);

  const c: Record<string, string> = Object.fromEntries(
    (scData || []).map((r: any) => [r.content_key, r.content_value])
  );

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Associations & Collaborations',
      'description':
        "Information about Dr. Fr. Roby Kannanchira CMI's professional associations and collaborative work globally.",
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
        {
          '@type': 'ListItem',
          'position': 3,
          'name': 'Associations',
          'item': 'https://frrobykannanchiracmi.com/associations',
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
              <Link href="/">Home</Link> <span>/</span> <Link href="/about">About</Link>{' '}
              <span>/</span> Associations
            </p>
            <h1>{c['assoc_page_title'] || 'Associations & Roles'}</h1>
            <p>
              {c['assoc_page_desc'] || 'Dr. Fr. Roby Kannanchira CMI holds significant roles across various national and international organizations, building bridges through collaboration.'}
            </p>
          </div>
        </div>

        {/* ─── INTRO ─── */}
        <section className="section">
          <div className="container">
            <div className="text-center fade-up" style={{ maxWidth: '700px', margin: '0 auto' }}>
              <span className="section-label">Global Network</span>
              <h2 className="section-title">Connected With The World For Peace</h2>
              <p>
                Over decades of service, Fr. Roby has built meaningful relationships with institutions,
                national governments, religious bodies, and civil society organizations across the
                globe — all united by the shared vision of a more harmonious world.
              </p>
            </div>
          </div>
        </section>

        {/* ─── UN SECTION ─── */}
        <section className="section section-alt">
          <div className="container">
            <div className="grid-2">
              <div className="fade-up">
                <span className="section-label">United Nations</span>
                <h2 className="section-title">NGO Representative at the United Nations</h2>
                <p style={{ marginBottom: '1.25rem' }}>
                  Fr. Roby serves as an official NGO Representative at the United Nations, participating
                  in sessions in New York, Geneva, and Vienna. In this capacity, he advocates for human
                  rights, interfaith harmony, sustainable development, and the rights of marginalized
                  communities.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                  His participation at the UN allows him to bring the voices of India's diverse
                  communities to the global stage, ensuring that the perspective of civil society is
                  heard in international decision-making.
                </p>
                <ul className="values-list">
                  <li>
                    <div className="v-icon">🗽</div>
                    <div>
                      <strong>New York – General Assembly</strong>
                      <span>Advocacy for interfaith peace education</span>
                    </div>
                  </li>
                  <li>
                    <div className="v-icon">🌍</div>
                    <div>
                      <strong>Geneva – Human Rights Council</strong>
                      <span>Representation on behalf of civil society</span>
                    </div>
                  </li>
                  <li>
                    <div className="v-icon">🏛️</div>
                    <div>
                      <strong>Vienna – UNOV</strong>
                      <span>Dialogue on cultural heritage and crime prevention</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="fade-up">
                <img
                  src="/assets/images/ngo-united-nations.webp"
                  alt="Dr. Fr. Roby at the United Nations"
                  loading="lazy"
                  width="1600"
                  height="864"
                  style={{ borderRadius: '16px', boxShadow: '0 12px 40px rgba(26,39,68,0.18)' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── KEY COLLABORATIONS ─── */}
        <section className="section">
          <div className="container">
            <div className="text-center fade-up">
              <span className="section-label">Partnerships</span>
              <h2 className="section-title">Key Associations &amp; Collaborators</h2>
            </div>
            <div className="grid-3 fade-up">
              <div className="feature-card">
                <div className="feature-icon">✝️</div>
                <h3>Apostolic Nunciature</h3>
                <p>
                  Regular collaboration with the Vatican's official representative in India on matters
                  of Catholic social engagement and interfaith relations.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🏛️</div>
                <h3>Government of India</h3>
                <p>
                  Partnership with national and state government bodies for cultural programmes, peace
                  initiatives, and social welfare activities.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎭</div>
                <h3>Cultural Institutions</h3>
                <p>
                  Deep collaboration with India's major cultural academies and institutions, including
                  collaboration with renowned artist Mallika Sarabhai.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🕌</div>
                <h3>Interfaith Forums</h3>
                <p>
                  Active member of multiple inter-religious dialogue forums, bringing together Hindu,
                  Muslim, Sikh, Buddhist, and Christian communities.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🌐</div>
                <h3>International Peace Organizations</h3>
                <p>
                  Collaborations with peace organizations in Taiwan, UAE, Rwanda, and other countries
                  for global summits and cultural diplomacy.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📚</div>
                <h3>Academic Institutions</h3>
                <p>
                  Partnerships with theological institutes, universities, and research centers for
                  academic exchange, lectures, and joint publications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── QUOTE ─── */}
        <div className="quote-section">
          <div className="container text-center">
            <p className="quote-text">
              "No single tradition can claim a monopoly on truth or peace. We need each other — and the
              wisdom of every tradition — to build the world we desire."
            </p>
            <p className="quote-author">— Dr. Fr. Roby Kannanchira CMI</p>
          </div>
        </div>

        {/* ─── GLOBAL REACH ─── */}
        <section className="section">
          <div className="container">
            <div className="text-center fade-up">
              <span className="section-label">Global Reach</span>
              <h2 className="section-title">Countries &amp; Regions</h2>
              <p className="section-desc">
                Fr. Roby's associations and collaborative work have spanned numerous countries across
                Asia, Europe, and the Americas.
              </p>
            </div>
            <div className="grid-4 fade-up">
              <div className="feature-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                <div className="feature-icon" style={{ margin: '0 auto 0.75rem', fontSize: '1.8rem' }}>
                  🇮🇳
                </div>
                <h3 style={{ fontSize: '0.95rem' }}>India</h3>
                <p style={{ fontSize: '0.82rem' }}>Delhi, Kerala, Lucknow, Kochi</p>
              </div>
              <div className="feature-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                <div className="feature-icon" style={{ margin: '0 auto 0.75rem', fontSize: '1.8rem' }}>
                  🇺🇳
                </div>
                <h3 style={{ fontSize: '0.95rem' }}>United Nations</h3>
                <p style={{ fontSize: '0.82rem' }}>New York, Geneva, Vienna</p>
              </div>
              <div className="feature-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                <div className="feature-icon" style={{ margin: '0 auto 0.75rem', fontSize: '1.8rem' }}>
                  🇹🇼
                </div>
                <h3 style={{ fontSize: '0.95rem' }}>Taiwan</h3>
                <p style={{ fontSize: '0.82rem' }}>International Peace Summit 2023</p>
              </div>
              <div className="feature-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                <div className="feature-icon" style={{ margin: '0 auto 0.75rem', fontSize: '1.8rem' }}>
                  🇦🇪
                </div>
                <h3 style={{ fontSize: '0.95rem' }}>UAE – Dubai</h3>
                <p style={{ fontSize: '0.82rem' }}>Global Peace Summit 2025</p>
              </div>
              <div className="feature-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                <div className="feature-icon" style={{ margin: '0 auto 0.75rem', fontSize: '1.8rem' }}>
                  🇷🇼
                </div>
                <h3 style={{ fontSize: '0.95rem' }}>Rwanda</h3>
                <p style={{ fontSize: '0.82rem' }}>Indo-Rwandan Cultural Exchange</p>
              </div>
              <div className="feature-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                <div className="feature-icon" style={{ margin: '0 auto 0.75rem', fontSize: '1.8rem' }}>
                  🇻🇦
                </div>
                <h3 style={{ fontSize: '0.95rem' }}>Vatican</h3>
                <p style={{ fontSize: '0.82rem' }}>Catholic Interfaith Commission</p>
              </div>
              <div className="feature-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                <div className="feature-icon" style={{ margin: '0 auto 0.75rem', fontSize: '1.8rem' }}>
                  🇬🇧
                </div>
                <h3 style={{ fontSize: '0.95rem' }}>Europe</h3>
                <p style={{ fontSize: '0.82rem' }}>Peace &amp; Dialogue Conferences</p>
              </div>
              <div className="feature-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                <div className="feature-icon" style={{ margin: '0 auto 0.75rem', fontSize: '1.8rem' }}>
                  🌏
                </div>
                <h3 style={{ fontSize: '0.95rem' }}>Asia Pacific</h3>
                <p style={{ fontSize: '0.82rem' }}>Regional interfaith coalitions</p>
              </div>
            </div>
          </div>
        </section>
      </IntersectionReveal>
    </>
  );
}
