import Link from 'next/link';
import IntersectionReveal from '@/components/IntersectionReveal';

export const metadata = {
  title: 'Terms of Use | Dr. Fr. Roby Kannanchira CMI',
  description:
    'Read the Terms of Use for the official website of Dr. Fr. Roby Kannanchira CMI. Understand the guidelines and terms governing site usage.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsOfUse() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Terms of Use',
      'description': 'Terms of Use for the official website of Dr. Fr. Roby Kannanchira CMI.',
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
          'name': 'Terms of Use',
          'item': 'https://frrobykannanchiracmi.com/terms',
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": jsonLd }) }}
      />

      <IntersectionReveal>
        {/* ─── PAGE HEADER ─── */}
        <div className="page-header" id="main-content">
          <div className="container">
            <p className="breadcrumb">
              <Link href="/">Home</Link> <span>/</span> Terms of Use
            </p>
            <h1>Terms of Use</h1>
            <p>Please read these Terms of Use carefully before using our website.</p>
          </div>
        </div>

        {/* ─── CONTENT SECTION ─── */}
        <section className="section" style={{ backgroundColor: 'var(--white)' }}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div
              className="fade-up"
              style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.8' }}
            >
              <p style={{ marginBottom: '1.5rem' }}>
                By accessing and using this website, you agree to be bound by the following terms and
                conditions. If you do not agree to these terms, please do not use this site.
              </p>

              <h2
                style={{
                  color: 'var(--navy)',
                  margin: '2rem 0 1rem',
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.5rem',
                }}
              >
                1. Acceptance of Terms
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>
                The services and content provided on this website are subject to these Terms of Use. We
                reserve the right to update or modify these terms at any time without prior notice to you.
                Your continued use of the website following any changes constitutes acceptance of those
                changes.
              </p>

              <h2
                style={{
                  color: 'var(--navy)',
                  margin: '2rem 0 1rem',
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.5rem',
                }}
              >
                2. Intellectual Property Rights
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>
                All content on this website, including text, graphics, logos, images, audio clips, and
                software, is the property of Dr. Fr. Roby Kannanchira CMI or its content suppliers and is
                protected by international copyright, trademark, and other intellectual property laws.
              </p>

              <h2
                style={{
                  color: 'var(--navy)',
                  margin: '2rem 0 1rem',
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.5rem',
                }}
              >
                3. User Conduct
              </h2>
              <p style={{ marginBottom: '1rem' }}>You agree to use the website only for lawful purposes. You are prohibited from:</p>
              <ul style={{ marginLeft: '2rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  Using the website in any manner that could disable, overburden, or impair the site or
                  interfere with any other party's use of the website.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  Attempting to gain unauthorized access to any part of the website, other accounts, or
                  computer systems connected to the website.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  Using any robot, spider, or other automatic device to monitor or copy any material on the
                  website without prior written consent.
                </li>
              </ul>

              <h2
                style={{
                  color: 'var(--navy)',
                  margin: '2rem 0 1rem',
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.5rem',
                }}
              >
                4. Disclaimer of Warranties
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>
                This website and all information, content, and materials included on or otherwise made
                available to you through this site are provided on an "as is" and "as available" basis,
                without any warranties of any kind, either express or implied.
              </p>

              <h2
                style={{
                  color: 'var(--navy)',
                  margin: '2rem 0 1rem',
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.5rem',
                }}
              >
                5. Limitation of Liability
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>
                In no event shall Dr. Fr. Roby Kannanchira CMI or any associated institutions be liable for
                any direct, indirect, incidental, special, or consequential damages arising out of or in
                connection with the use of, or inability to use, this website or its content.
              </p>

              <h2
                style={{
                  color: 'var(--navy)',
                  margin: '2rem 0 1rem',
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.5rem',
                }}
              >
                6. Contact Information
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>
                If you have any questions or concerns regarding these Terms of Use, please contact us at{' '}
                <a
                  href="mailto:robykannan@gmail.com"
                  style={{ color: 'var(--gold)', textDecoration: 'underline' }}
                >
                  robykannan@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </IntersectionReveal>
    </>
  );
}
