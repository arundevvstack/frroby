import type { Metadata } from 'next';
import './globals.css';
import SiteShell from '@/components/SiteShell';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Dr. Fr. Roby Kannanchira CMI | Global Peace & Cultural Ambassador',
  description:
    'Official website of Dr. Fr. Roby Kannanchira CMI — Visionary leader, UN NGO Representative, and Director of Chavara Cultural Centre. Championing interfaith harmony and global peace.',
  keywords: [
    'Dr. Fr. Roby Kannanchira CMI',
    'Chavara Cultural Centre',
    'Interfaith Harmony',
    'UN NGO Representative',
    'Peace Ambassador',
    'CMI Priest',
  ],
  metadataBase: new URL('https://frrobykannanchiracmi.com/'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://frrobykannanchiracmi.com/',
    title: 'Dr. Fr. Roby Kannanchira CMI | Building Bridges Through Faith',
    description:
      'Discover the life and mission of Dr. Fr. Roby Kannanchira CMI, dedicated to interfaith dialogue and international peace.',
    images: [
      {
        url: '/assets/images/frroby-portrait.webp',
        width: 943,
        height: 882,
        alt: 'Dr. Fr. Roby Kannanchira CMI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr. Fr. Roby Kannanchira CMI',
    description: 'Visionary leader promoting interfaith harmony and global cultural preservation.',
    images: ['/assets/images/frroby-portrait.webp'],
  },
  other: {
    'X-XSS-Protection': '1; mode=block',
    'X-Content-Type-Options': 'nosniff',
    referrer: 'strict-origin-when-cross-origin',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: scData } = await supabase.from('site_content').select('content_key, content_value').eq('page', 'footer');
  
  const c: Record<string, string> = Object.fromEntries(
    (scData || []).map((r: any) => [r.content_key, r.content_value])
  );

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <SiteShell navbar={<Navbar />} footer={<Footer content={c} />}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
