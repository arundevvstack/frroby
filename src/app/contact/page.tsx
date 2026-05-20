import Link from 'next/link';
import IntersectionReveal from '@/components/IntersectionReveal';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Contact Dr. Fr. Roby Kannanchira CMI | Get in Touch',
  description:
    'Reach out to Dr. Fr. Roby Kannanchira CMI for collaborations, speaking engagements, or inquiries regarding the Chavara Cultural Centre and interfaith initiatives.',
  alternates: {
    canonical: '/contact',
  },
};

export default async function Contact() {
  const supabase = await createClient();
  const { data: scData } = await supabase.from('site_content').select('content_key, content_value').eq('page', 'contact');
  const c: Record<string, string> = Object.fromEntries(
    (scData || []).map((r: any) => [r.content_key, r.content_value])
  );

  const email = c['contact_email'] || 'robykannan@gmail.com';
  const phone = c['contact_phone'] || '+91 94478 24575';
  const location = c['contact_location'] || 'Chavara Cultural Centre, New Delhi, India';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      'name': 'Contact Dr. Fr. Roby Kannanchira CMI',
      'description':
        'Reach out to Dr. Fr. Roby Kannanchira CMI for collaborations, speaking engagements, or inquiries regarding the Chavara Cultural Centre and interfaith initiatives.',
      'url': 'https://frrobykannanchiracmi.com/contact',
      'mainEntity': {
        '@type': 'Person',
        'name': 'Dr. Fr. Roby Kannanchira CMI',
        'email': 'robykannan@gmail.com',
        'telephone': '+91 94478 24575',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'New Delhi',
          'addressCountry': 'India',
        },
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
          'name': 'Contact',
          'item': 'https://frrobykannanchiracmi.com/contact',
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
              <Link href="/">Home</Link> <span>/</span> Contact
            </p>
            <h1>{c['contact_page_title'] || 'Get in Touch'}</h1>
            <p>
              {c['contact_page_subtitle'] || 'Peace begins when we celebrate the other. Let us build a world where every faith, every life, and every voice is honored.'}
            </p>
          </div>
        </div>

        {/* ─── CONTACT MAIN ─── */}
        <section className="section">
          <div className="container">
            <div className="grid-2" style={{ gap: '3rem', alignItems: 'start' }}>
              {/* LEFT: Info + Photo + Video */}
              <div className="fade-up">
                <span className="section-label">Let's Work Together</span>
                <h2 className="section-title">Reach Out to Fr. Roby</h2>
                <p style={{ marginBottom: '2rem' }}>
                  {c['contact_intro_text'] || 'If you are interested in collaborating for interfaith programs, cultural events, peace education sessions, or organizing interreligious initiatives in India or abroad, please reach out.'}
                </p>

                {/* Use Cases */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>✦</span>
                    <span style={{ fontSize: '0.95rem' }}>Collaborating for interfaith programs &amp; cultural events</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>✦</span>
                    <span style={{ fontSize: '0.95rem' }}>Hosting peace education sessions in schools or institutions</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>✦</span>
                    <span style={{ fontSize: '0.95rem' }}>Organizing interreligious initiatives in India or abroad</span>
                  </div>
                </div>

                {/* Contact Cards */}
                <div className="contact-card" style={{ marginBottom: '1.5rem' }}>
                  <h3
                    style={{
                      marginBottom: '1.5rem',
                      fontSize: '1.1rem',
                      color: 'var(--gold)',
                      borderBottom: '1px solid var(--border)',
                      paddingBottom: '0.75rem',
                    }}
                  >
                    📍 Delhi Office
                  </h3>
                  <div className="contact-info-item">
                    <div className="contact-info-icon">✉️</div>
                    <div className="contact-info-text">
                      <strong>Email</strong>
                      <span>
                        <a href={`mailto:${email}`} style={{ color: 'var(--gold)' }}>
                          {email}
                        </a>
                      </span>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <div className="contact-info-icon">📞</div>
                    <div className="contact-info-text">
                      <strong>Phone</strong>
                      <span>
                        <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'var(--gold)' }}>
                          {phone}
                        </a>
                      </span>
                    </div>
                  </div>
                  <div className="contact-info-item" style={{ marginBottom: 0 }}>
                    <div className="contact-info-icon">🏛️</div>
                    <div className="contact-info-text">
                      <strong>Location</strong>
                      <span>{location}</span>
                    </div>
                  </div>
                </div>

                {/* Photo */}
                <img
                  src={c['contact_image'] || '/assets/images/contact-photo.webp'}
                  alt="Dr. Fr. Roby Kannanchira CMI in dialogue"
                  loading="lazy"
                  width="1024"
                  height="935"
                  style={{
                    borderRadius: '16px',
                    width: '100%',
                    objectFit: 'cover',
                    maxHeight: '280px',
                    boxShadow: '0 8px 32px rgba(26,39,68,0.15)',
                  }}
                />
              </div>

              {/* RIGHT: Form */}
              <div className="fade-up">
                <div className="contact-card" style={{ position: 'sticky', top: '100px' }}>
                  <h3 style={{ marginBottom: '0.4rem' }}>Send a Message</h3>
                  <p style={{ marginBottom: '1.75rem', fontSize: '0.88rem' }}>
                    Fill in the form and Fr. Roby's team will get back to you within 48 hours.
                  </p>

                  <form
                    className="contact-form"
                    id="contactForm"
                    action="https://formspree.io/f/xbljkwpk"
                    method="POST"
                  >
                    <div className="form-row-2">
                      <div>
                        <label htmlFor="firstName">First Name *</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          placeholder="Your first name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName">Last Name *</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          placeholder="Your last name"
                          required
                        />
                      </div>
                    </div>
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your@email.com"
                      required
                    />
                    <label htmlFor="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" placeholder="+91 00000 00000" />
                    <label htmlFor="subject">Subject</label>
                    <input type="text" id="subject" name="subject" placeholder="Reason for contact" />
                    <label htmlFor="interest">Area of Interest</label>
                    <select id="interest" name="interest">
                      <option value="">Select an area…</option>
                      <option>Interfaith Programme Collaboration</option>
                      <option>Peace Education Session</option>
                      <option>Cultural Event Partnership</option>
                      <option>Interreligious Initiative</option>
                      <option>Speaking / Lecture Invitation</option>
                      <option>Media / Press Enquiry</option>
                      <option>Other</option>
                    </select>
                    <label htmlFor="message">Your Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Share your ideas, programme details, or questions…"
                      required
                    ></textarea>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center', borderRadius: '8px', padding: '14px' }}
                    >
                      Send Message →
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── MAP / ADDRESS SECTION ─── */}
        <section className="section section-alt">
          <div className="container">
            <div className="text-center fade-up">
              <span className="section-label">Location</span>
              <h2 className="section-title">Find the Chavara Cultural Centre</h2>
            </div>
            <div className="grid-3 fade-up" style={{ marginTop: '2.5rem' }}>
              <div className="feature-card" style={{ textAlign: 'center' }}>
                <div className="feature-icon" style={{ margin: '0 auto 1rem' }}>
                  📍
                </div>
                <h3>Delhi Office</h3>
                <p>
                  Chavara Cultural Centre
                  <br />
                  {location}
                </p>
                <br />
                <p>
                  <a href={`mailto:${email}`} style={{ color: 'var(--gold)' }}>
                  {email}
                </a>
                </p>
                <p>
                <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'var(--gold)' }}>
                  {phone}
                </a>
                </p>
              </div>
              <div className="feature-card" style={{ textAlign: 'center' }}>
                <div className="feature-icon" style={{ margin: '0 auto 1rem' }}>
                  🕐
                </div>
                <h3>Office Hours</h3>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--navy)' }}>Monday – Friday</strong>
                  <br />
                  {c['contact_office_weekday'] || '9:00 AM – 5:00 PM IST'}
                </p>
                <p>
                  <strong style={{ color: 'var(--navy)' }}>Saturday</strong>
                  <br />
                  {c['contact_office_saturday'] || '10:00 AM – 1:00 PM IST'}
                </p>
                <br />
                <span className="tag tag-gold">Appointments Preferred</span>
              </div>
              <div className="feature-card" style={{ textAlign: 'center' }}>
                <div className="feature-icon" style={{ margin: '0 auto 1rem' }}>
                  ⚡
                </div>
                <h3>Urgent Queries</h3>
                <p>
                  For media enquiries, urgent collaboration proposals, or event invitations, please
                  email directly with "URGENT" in the subject line.
                </p>
                <br />
                <a href="mailto:robykannan@gmail.com?subject=URGENT: " className="btn btn-primary btn-sm">
                  Email Now
                </a>
              </div>
            </div>
          </div>
        </section>
      </IntersectionReveal>
    </>
  );
}
