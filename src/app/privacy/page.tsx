import Link from 'next/link';
import IntersectionReveal from '@/components/IntersectionReveal';
import LiveText from '@/components/LiveText';

export const metadata = {
  title: 'Privacy Policy | Dr. Fr. Roby Kannanchira CMI',
  description:
    'Read the Privacy Policy for the official website of Dr. Fr. Roby Kannanchira CMI. Learn how we handle and protect your personal information.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPolicy() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Privacy Policy',
      'description': 'Privacy Policy for the official website of Dr. Fr. Roby Kannanchira CMI.',
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
          'name': 'Privacy Policy',
          'item': 'https://frrobykannanchiracmi.com/privacy',
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
              <Link href="/">Home</Link> <span>/</span> Privacy Policy
            </p>
            <h1><LiveText contentKey="privacy_page_title" initialValue="Privacy Policy" /></h1>
            <p><LiveText contentKey="privacy_page_desc" initialValue="We value your privacy and are committed to protecting your personal information." tagName="span" /></p>
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
                This Privacy Policy describes how your personal information is collected, used, and shared
                when you visit or use our website. We are dedicated to maintaining the trust and
                confidence of our visitors.
              </p>

              <h2
                style={{
                  color: 'var(--navy)',
                  margin: '2rem 0 1rem',
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.5rem',
                }}
              >
                1. Information We Collect
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                When you visit the Site, we automatically collect certain information about your device,
                including information about your web browser, IP address, time zone, and some of the cookies
                that are installed on your device.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                Additionally, when you submit a message through our contact form, we collect the personal
                information you provide us, such as your name, email address, and the content of your
                message.
              </p>

              <h2
                style={{
                  color: 'var(--navy)',
                  margin: '2rem 0 1rem',
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.5rem',
                }}
              >
                2. How We Use Your Information
              </h2>
              <p style={{ marginBottom: '1rem' }}>We use the information we collect to:</p>
              <ul style={{ marginLeft: '2rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  Respond to inquiries and messages submitted via the contact form.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>Monitor website performance and security.</li>
                <li style={{ marginBottom: '0.5rem' }}>Improve our website usability and structure.</li>
              </ul>

              <h2
                style={{
                  color: 'var(--navy)',
                  margin: '2rem 0 1rem',
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.5rem',
                }}
              >
                3. Security of Your Data
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>
                We implement a variety of security measures to maintain the safety of your personal
                information. Your personal data is stored in secured networks and is only accessible by a
                limited number of persons who have special access rights to such systems.
              </p>

              <h2
                style={{
                  color: 'var(--navy)',
                  margin: '2rem 0 1rem',
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.5rem',
                }}
              >
                4. Third-Party Services
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>
                We do not sell, trade, or otherwise transfer to outside parties your personally
                identifiable information. This does not include trusted third parties who assist us in
                operating our website, such as Formspree for form submissions, so long as those parties
                agree to keep this information confidential.
              </p>

              <h2
                style={{
                  color: 'var(--navy)',
                  margin: '2rem 0 1rem',
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.5rem',
                }}
              >
                5. Changes to This Policy
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>
                We may update this privacy policy from time to time in order to reflect, for example, changes
                to our practices or for other operational, legal, or regulatory reasons.
              </p>

              <h2
                style={{
                  color: 'var(--navy)',
                  margin: '2rem 0 1rem',
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.5rem',
                }}
              >
                6. Contact Us
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>
                For more information about our privacy practices, or if you have questions, please contact us
                by e-mail at{' '}
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
