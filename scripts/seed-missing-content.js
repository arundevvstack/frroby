const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const newContent = [
  // Initiatives Page
  { content_key: 'init_page_title', content_value: 'Initiatives & Contributions', label: 'Page Title', page: 'initiatives', section: 'header' },
  { content_key: 'init_page_desc', content_value: 'Decades of transformative work across faith, culture, education, and international advocacy — touching millions of lives.', label: 'Page Description', page: 'initiatives', section: 'header' },
  
  { content_key: 'init_ccc_label', content_value: 'Flagship Institution', label: 'Chavara Label', page: 'initiatives', section: 'chavara_centre' },
  { content_key: 'init_ccc_title', content_value: 'Chavara Cultural Centre, Delhi', label: 'Chavara Title', page: 'initiatives', section: 'chavara_centre' },
  { content_key: 'init_ccc_desc1', content_value: 'As the Director of the Chavara Cultural Centre in Delhi, Fr. Roby has transformed it into one of the most vibrant hubs for intercultural and interfaith dialogue in the national capital. Named after Blessed Kuriakose Elias Chavara, the Centre serves as a bridge between Kerala\'s rich cultural heritage and the diverse communities of Delhi.', label: 'Chavara Desc 1', page: 'initiatives', section: 'chavara_centre' },
  { content_key: 'init_ccc_desc2', content_value: 'The Centre hosts hundreds of programmes annually — from classical arts performances and literary festivals to interfaith prayer services, youth leadership camps, and community welfare initiatives.', label: 'Chavara Desc 2', page: 'initiatives', section: 'chavara_centre' },
  
  { content_key: 'init_areas_label', content_value: 'Areas of Work', label: 'Areas Label', page: 'initiatives', section: 'grid' },
  { content_key: 'init_areas_title', content_value: 'Key Departments & Ministries', label: 'Areas Title', page: 'initiatives', section: 'grid' },
  
  { content_key: 'init_intl_label', content_value: 'International Presence', label: 'Intl Label', page: 'initiatives', section: 'international' },
  { content_key: 'init_intl_title', content_value: 'Global Initiatives', label: 'Intl Title', page: 'initiatives', section: 'international' },

  { content_key: 'init_un_quote', content_value: '"At the United Nations, every voice counts. Fr. Roby ensures that the voice of India\'s interfaith communities is heard loudly and clearly."', label: 'UN Quote', page: 'initiatives', section: 'un_ngo' },
  { content_key: 'init_un_label', content_value: 'United Nations Role', label: 'UN Label', page: 'initiatives', section: 'un_ngo' },
  { content_key: 'init_un_title', content_value: 'NGO Representative at the UN', label: 'UN Title', page: 'initiatives', section: 'un_ngo' },
  { content_key: 'init_un_desc', content_value: 'Fr. Roby participates in United Nations sessions in New York, Geneva, and Vienna. He advocates for peace, human rights, and the rights of religious minorities on behalf of civil society organizations.', label: 'UN Desc', page: 'initiatives', section: 'un_ngo' },

  // Footer
  { content_key: 'footer_brand_desc', content_value: 'Official website of Dr. Fr. Roby Kannanchira CMI — dedicated to promoting interfaith harmony, cultural preservation, and social empowerment across the globe.', label: 'Brand Description', page: 'footer', section: 'brand' },
  { content_key: 'footer_tagline', content_value: '✦ Building Bridges Through Faith, Culture & Service', label: 'Tagline', page: 'footer', section: 'brand' },
  { content_key: 'footer_nav_title', content_value: 'Navigation', label: 'Nav Column Title', page: 'footer', section: 'links' },
  { content_key: 'footer_init_title', content_value: 'Initiatives', label: 'Init Column Title', page: 'footer', section: 'links' },
  { content_key: 'footer_contact_title', content_value: 'Contact', label: 'Contact Column Title', page: 'footer', section: 'links' },
  { content_key: 'footer_copyright', content_value: 'Dr. Fr. Roby Kannanchira CMI. All Rights Reserved.', label: 'Copyright Text', page: 'footer', section: 'bottom' },
  { content_key: 'footer_credit', content_value: 'Designed with ✦ for Peace & Harmony', label: 'Credit Text', page: 'footer', section: 'bottom' },

  // Associations Page
  { content_key: 'assoc_page_title', content_value: 'Associations & Roles', label: 'Page Title', page: 'associations', section: 'header' },
  { content_key: 'assoc_page_desc', content_value: 'Dr. Fr. Roby Kannanchira CMI holds significant roles across various national and international organizations, building bridges through collaboration.', label: 'Page Description', page: 'associations', section: 'header' },
  
  // Gallery Page
  { content_key: 'gallery_page_title', content_value: 'Media Gallery', label: 'Page Title', page: 'gallery', section: 'header' },
  { content_key: 'gallery_page_desc', content_value: 'Glimpses of international summits, cultural events, community initiatives, and moments of interfaith harmony.', label: 'Page Description', page: 'gallery', section: 'header' }
];

async function seed() {
  console.log('Seeding missing content keys...');
  for (const item of newContent) {
    const { data, error } = await supabase
      .from('site_content')
      .upsert(item, { onConflict: 'content_key' });
      
    if (error) {
      console.error(`Error inserting ${item.content_key}:`, error);
    } else {
      console.log(`Inserted/Updated ${item.content_key}`);
    }
  }
  console.log('Done!');
}

seed();
