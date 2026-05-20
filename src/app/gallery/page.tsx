import { createClient } from '@/lib/supabase/server';
import GalleryClient from './GalleryClient';

export const metadata = {
  title: 'Photo Gallery | Dr. Fr. Roby Kannanchira CMI',
  description: 'Visual collection of peace summits, cultural events, awards, and interfaith gatherings of Dr. Fr. Roby Kannanchira CMI.',
  alternates: { canonical: '/gallery' },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Gallery() {
  const supabase = await createClient();
  const [{ data: dbItems }, { data: scData }] = await Promise.all([
    supabase.from('gallery').select('*').order('created_at', { ascending: false }),
    supabase.from('site_content').select('content_key, content_value').eq('page', 'gallery')
  ]);

  const c: Record<string, string> = Object.fromEntries(
    (scData || []).map((r: any) => [r.content_key, r.content_value])
  );

  return <GalleryClient dbItems={dbItems ?? []} content={c} />;
}
