-- ============================================================
-- FRROBY WEBSITE: Full Database Setup & Content Seed
-- Run this ONCE in the Supabase SQL Editor
-- ============================================================

-- ─── 1. STORAGE BUCKET FOR IMAGE UPLOADS ─────────────────────
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Storage policies
create policy "public_read_images" on storage.objects for select using (bucket_id = 'images');
create policy "anon_upload_images" on storage.objects for insert with check (bucket_id = 'images');
create policy "anon_update_images" on storage.objects for update using (bucket_id = 'images');
create policy "anon_delete_images" on storage.objects for delete using (bucket_id = 'images');


-- ─── 2. SITE CONTENT TABLE (Key-Value CMS) ──────────────────
create table if not exists public.site_content (
  id uuid default gen_random_uuid() primary key,
  content_key text unique not null,
  content_value text not null default '',
  content_type text default 'text',     -- 'text', 'image', 'html'
  label text,                            -- human-readable label for admin UI
  page text,                             -- which page (home, about, contact)
  section text,                          -- which section (hero, philosophy, intro...)
  updated_at timestamptz default now()
);

alter table public.site_content enable row level security;

-- Everyone can read
create policy "site_content_public_read" on public.site_content
  for select using (true);

-- Anon can also write (admin panel runs on anon key)
create policy "site_content_anon_write" on public.site_content
  for all using (true) with check (true);


-- ─── 3. SEED: HOME PAGE CONTENT ──────────────────────────────
insert into public.site_content (content_key, content_value, content_type, label, page, section) values

-- Hero Section
('hero_badge',        'CMI Priest · UN NGO Representative · Cultural Ambassador', 'text', 'Hero Badge Text', 'home', 'hero'),
('hero_title_line1',  'Dr. Fr. Roby',                                             'text', 'Hero Title Line 1', 'home', 'hero'),
('hero_title_line2',  'Kannanchira',                                               'text', 'Hero Title Line 2 (italic)', 'home', 'hero'),
('hero_subtitle',     'Director, Chavara Cultural Centre, Delhi',                  'text', 'Hero Subtitle', 'home', 'hero'),
('hero_description',  'A visionary leader dedicated to promoting interfaith harmony, cultural preservation, and social empowerment. His efforts have touched lives across the globe through faith, dialogue, and compassionate service.', 'text', 'Hero Description', 'home', 'hero'),
('hero_image',        '/assets/images/frroby-portrait.webp',                       'image', 'Hero Portrait Image', 'home', 'hero'),
('hero_image_mobile', '/assets/images/frroby-portrait-mobile.webp',                'image', 'Hero Portrait (Mobile)', 'home', 'hero'),

-- Quote Section
('quote_text',   '"Peace Begins When We Start Celebrating the Other."',  'text', 'Quote Text', 'home', 'quote'),
('quote_author', '— Dr. Fr. Roby Kannanchira CMI',                      'text', 'Quote Author', 'home', 'quote'),

-- Philosophy Section
('philosophy_label',       'His Philosophy',                                                                                                 'text', 'Philosophy Section Label', 'home', 'philosophy'),
('philosophy_title',       'Building Bridges, Not Walls',                                                                                    'text', 'Philosophy Title', 'home', 'philosophy'),
('philosophy_description', 'The world today needs fewer barriers and more bridges. As people of faith, youth, and leaders — our mission must be to connect, not divide.', 'text', 'Philosophy Description', 'home', 'philosophy'),
('philosophy_image',       '/assets/images/building-bridges.webp',                                                                           'image', 'Philosophy Image', 'home', 'philosophy'),
('philosophy_image_mobile','/assets/images/building-bridges-mobile.webp',                                                                    'image', 'Philosophy Image (Mobile)', 'home', 'philosophy'),

-- Philosophy Values
('philosophy_value_1_title', 'Replace suspicion with trust',                                      'text', 'Value 1 Title', 'home', 'philosophy'),
('philosophy_value_1_desc',  'Fostering genuine understanding between different faith communities','text', 'Value 1 Description', 'home', 'philosophy'),
('philosophy_value_2_title', 'Replace hostility with dialogue',                                   'text', 'Value 2 Title', 'home', 'philosophy'),
('philosophy_value_2_desc',  'Creating safe spaces for honest, respectful interfaith conversation','text', 'Value 2 Description', 'home', 'philosophy'),
('philosophy_value_3_title', 'Replace ignorance with understanding',                              'text', 'Value 3 Title', 'home', 'philosophy'),
('philosophy_value_3_desc',  'Education and cultural immersion as tools for lasting peace',        'text', 'Value 3 Description', 'home', 'philosophy'),
('philosophy_value_4_title', 'Celebrate diversity',                                                'text', 'Value 4 Title', 'home', 'philosophy'),
('philosophy_value_4_desc',  'Honoring every faith, every life, and every voice as sacred',        'text', 'Value 4 Description', 'home', 'philosophy'),

-- ─── 4. SEED: ABOUT PAGE CONTENT ─────────────────────────────

('about_page_title',    'About Fr. Roby',                                                                                                                                                       'text', 'About Page Title', 'about', 'header'),
('about_page_subtitle', 'A visionary Carmelite priest dedicated to building a more peaceful and harmonious world through faith, culture, and dialogue.',                                           'text', 'About Page Subtitle', 'about', 'header'),
('about_image',         '/assets/images/frroby-about.webp',                                                                                                                                     'image', 'About Portrait Image', 'about', 'intro'),
('about_image_mobile',  '/assets/images/frroby-about-mobile.webp',                                                                                                                              'image', 'About Portrait (Mobile)', 'about', 'intro'),
('about_intro_text_1',  'Dr. Fr. Roby Kannanchira CMI is a visionary leader, scholar, and spiritual guide dedicated to promoting interfaith harmony, cultural preservation, and social empowerment. As Director of the Chavara Cultural Centre, Delhi, and an active NGO Representative at the United Nations, his efforts have touched lives across the globe.', 'text', 'About Intro Paragraph 1', 'about', 'intro'),
('about_intro_text_2',  'Born and raised in Kerala, India, Fr. Roby brought the rich spiritual heritage of the Carmelites of Mary Immaculate (CMI) to bear on the pressing challenges of inter-religious dialogue and cultural understanding in contemporary India and beyond.',                                                                                    'text', 'About Intro Paragraph 2', 'about', 'intro'),
('about_intro_quote',   '"Every tradition carries within it seeds of peace. Our task is to nurture those seeds together — across all boundaries of faith and culture."',                           'text', 'About Highlight Quote', 'about', 'intro'),
('about_bio_text_1',    'Fr. Roby Kannanchira CMI is a priest of the Carmelites of Mary Immaculate (CMI), one of India''s first indigenous Catholic religious congregations founded by Blessed Kuriakose Elias Chavara. He has served the Church and society in multiple capacities — as a theologian, educator, cultural activist, and international advocate.',    'text', 'Biography Paragraph 1', 'about', 'biography'),
('about_bio_text_2',    'A Doctorate in Theology specializing in Interreligious Dialogue, his academic work has been widely recognized in theological circles. He has lectured at universities and conferences around the world, sharing insights on peace, dialogue, and the spirituality of encounter.',                                                            'text', 'Biography Paragraph 2', 'about', 'biography'),
('about_bio_text_3',    'As Director of the Chavara Cultural Centre in Delhi, Fr. Roby transforms the centre into a vibrant meeting place for arts, culture, spirituality, and interfaith encounter. Under his leadership, the Centre has organized hundreds of programmes bringing together people of diverse faiths and backgrounds.',                               'text', 'Biography Paragraph 3', 'about', 'biography'),

-- ─── 5. SEED: CONTACT PAGE CONTENT ───────────────────────────

('contact_page_title',      'Get in Touch',                                                                                                                                  'text', 'Contact Page Title', 'contact', 'header'),
('contact_page_subtitle',   'Peace begins when we celebrate the other. Let us build a world where every faith, every life, and every voice is honored.',                        'text', 'Contact Page Subtitle', 'contact', 'header'),
('contact_intro_text',      'If you are interested in collaborating for interfaith programs, cultural events, peace education sessions, or organizing interreligious initiatives in India or abroad, please reach out.', 'text', 'Contact Intro Text', 'contact', 'intro'),
('contact_email',           'robykannan@gmail.com',                                                                                                                           'text', 'Email Address', 'contact', 'info'),
('contact_phone',           '+91 94478 24575',                                                                                                                                'text', 'Phone Number', 'contact', 'info'),
('contact_location',        'Chavara Cultural Centre, New Delhi, India',                                                                                                       'text', 'Location / Address', 'contact', 'info'),
('contact_office_weekday',  '9:00 AM – 5:00 PM IST',                                                                                                                          'text', 'Weekday Office Hours', 'contact', 'info'),
('contact_office_saturday', '10:00 AM – 1:00 PM IST',                                                                                                                          'text', 'Saturday Office Hours', 'contact', 'info'),
('contact_image',           '/assets/images/contact-photo.webp',                                                                                                               'image', 'Contact Page Photo', 'contact', 'intro')

on conflict (content_key) do nothing;


-- ─── 6. SEED: AWARDS (if empty) ──────────────────────────────
insert into public.awards (year, title, description, image_url)
select * from (values
  (2023, 'International Peace & Harmony Award', 'Taiwan – Awarded for outstanding contributions to global peace, interfaith dialogue, and cultural diplomacy.', '/assets/images/award-taiwan-2023.webp'),
  (2012, 'Stallin International Award for Peace & Harmony', 'Kochi – Recognizing exemplary leadership in promoting communal harmony and peaceful coexistence in India.', '/assets/images/award-stallin-2012.webp'),
  (0,    'NGO Representative at the United Nations', 'Serving as an official NGO representative, Fr. Roby advocates for human rights, peace, and social justice at the global level.', '/assets/images/ngo-united-nations.webp')
) as v(year, title, description, image_url)
where not exists (select 1 from public.awards limit 1);


-- ─── 7. SEED: EVENTS (if empty) ──────────────────────────────
insert into public.events (title, category, description, event_date, image_url)
select * from (values
  ('ART FOR PEACE: Indo–Rwandan Cultural Night, New Delhi', 'News · July 2025', 'The Art for Peace: Indo–Rwandan Cultural Program was a celebration of harmony through art and diplomacy held in New Delhi.', '2025-07-01'::date, '/assets/images/news-1.webp'),
  ('Global Justice, Love & Peace Summit 2025, Dubai', 'News · April 2025', 'Rev. Dr. Roby participated as a distinguished speaker at the Global Justice, Love & Peace Summit held in Dubai, April 12–13, 2025.', '2025-04-13'::date, '/assets/images/news-2.webp'),
  ('Condolence Meeting in Honor of His Holiness Pope Francis', 'News · May 2025', 'A solemn condolence gathering was held in New Delhi to honor the memory of His Holiness Pope Francis.', '2025-05-01'::date, '/assets/images/news-3.webp')
) as v(title, category, description, event_date, image_url)
where not exists (select 1 from public.events limit 1);


-- ─── 8. SEED: INITIATIVES (if empty) ─────────────────────────
insert into public.initiatives (title, category, description, image_url)
select * from (values
  ('Interfaith Dialogue',  'Flagship', 'Organizing regular inter-religious dialogues, seminars, and joint prayer services with Hindu, Muslim, Sikh, Buddhist, Jain, and Christian communities.', '/assets/images/contrib-1.webp'),
  ('Arts & Culture',       'Active',   'Promoting classical performing arts, visual arts, film, and literature as tools for cultural understanding and community building.', '/assets/images/contrib-2.webp'),
  ('Youth Empowerment',    'Active',   'Leadership training, camps, and workshops for young people to become ambassadors of peace and interreligious understanding.', '/assets/images/contrib-3.webp'),
  ('Peace Education',      'Ongoing',  'Curricula and resource development for peace education in schools, colleges, and faith formation centres across India.', '/assets/images/contrib-4.webp'),
  ('Social Welfare',       'Active',   'Community welfare programmes offering healthcare, educational support, legal awareness, and livelihood assistance to the underprivileged.', ''),
  ('Publications & Media', 'Ongoing',  'Academic articles, books, and media productions on interfaith theology, cultural studies, and the spirituality of encounter.', '')
) as v(title, category, description, image_url)
where not exists (select 1 from public.initiatives limit 1);


-- ─── 9. SEED: GALLERY (if empty) ─────────────────────────────
insert into public.gallery (title, image_url, category)
select * from (values
  ('National cultural festival event',                         '/assets/images/gallery-1.webp',         'events'),
  ('Interfaith award ceremony',                                '/assets/images/gallery-2.webp',         'events'),
  ('Global interfaith dialogue gathering',                     '/assets/images/contrib-1.webp',         'events'),
  ('Community development program in Delhi',                   '/assets/images/contrib-2.webp',         'events'),
  ('Peace and harmony community walk',                         '/assets/images/gallery-3.webp',         'community'),
  ('Cultural yoga and wellness workshop',                      '/assets/images/gallery-4.webp',         'events'),
  ('Fr. Roby receiving International Peace Award in Taiwan',   '/assets/images/award-taiwan-2023.webp', 'awards'),
  ('Stallin International Award for Global Peace',             '/assets/images/award-stallin-2012.webp','awards'),
  ('Fr. Roby at the United Nations General Assembly',          '/assets/images/ngo-united-nations.webp','international'),
  ('Peace Summit Speaker Session in Dubai',                    '/assets/images/news-2.webp',            'international'),
  ('Indo-Rwandan Cultural Night Celebration',                  '/assets/images/news-1.webp',            'international'),
  ('Vatican delegation and memorial event',                    '/assets/images/news-3.webp',            'international')
) as v(title, image_url, category)
where not exists (select 1 from public.gallery limit 1);
