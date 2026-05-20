import { createClient } from '@/lib/supabase/server';
import GalleryClient from './GalleryClient';

export const metadata = {
  title: 'Photo Gallery | Dr. Fr. Roby Kannanchira CMI',
  description: 'Visual collection of peace summits, cultural events, awards, and interfaith gatherings of Dr. Fr. Roby Kannanchira CMI.',
  alternates: { canonical: '/gallery' },
};

export default async function Gallery() {
  const supabase = await createClient();
  const { data: dbItems } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });

  return <GalleryClient dbItems={dbItems ?? []} />;
}
