-- Supabase Schema for Dr. Fr. Roby CMI CMS Website

-- Drop existing tables if they exist (for clean initialization)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS awards CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS associations CASCADE;
DROP TABLE IF EXISTS initiatives CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- 1. Site Settings (Global configurations)
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Initiatives
CREATE TABLE initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL, -- e.g., 'Education', 'Social Service', 'Media & Culture', 'Interfaith'
  description TEXT NOT NULL,
  content TEXT, -- Detailed rich text / body content
  image_url VARCHAR(512),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Associations
CREATE TABLE associations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(512),
  role VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Gallery Items
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  caption TEXT,
  image_url VARCHAR(512) NOT NULL,
  category VARCHAR(100) DEFAULT 'General', -- e.g., 'Initiatives', 'Awards', 'Missions'
  tags VARCHAR(50)[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Awards & Achievements
CREATE TABLE awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(512),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. News & Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'Event',
  description TEXT NOT NULL,
  content TEXT, -- Detailed post contents
  image_url VARCHAR(512),
  event_date DATE NOT NULL,
  external_link VARCHAR(512),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. FAQs
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Contact Form Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create Policies

-- A. Public Read-Only Policies (Everyone can read content)
CREATE POLICY "Allow public read access to site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access to initiatives" ON initiatives FOR SELECT USING (true);
CREATE POLICY "Allow public read access to associations" ON associations FOR SELECT USING (true);
CREATE POLICY "Allow public read access to gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow public read access to awards" ON awards FOR SELECT USING (true);
CREATE POLICY "Allow public read access to events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public read access to faqs" ON faqs FOR SELECT USING (true);

-- B. Public Write-Only Policy for Contact Messages (Anyone can submit a contact message)
CREATE POLICY "Allow public inserts to messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin select/update/delete on messages" ON messages 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- C. Admin Write Policies (Only authenticated users can manage content)
CREATE POLICY "Allow admin full access to site_settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access to initiatives" ON initiatives FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access to associations" ON associations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access to gallery" ON gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access to awards" ON awards FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access to events" ON events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access to faqs" ON faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);
