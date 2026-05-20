const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
  const sqlPath = path.join(__dirname, '../supabase/schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  // Supabase PostgreSQL Connection String
  // Format: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
  const connectionString = 'postgresql://postgres:saftley@db.qdkamlikvebkbohhcfjx.supabase.co:5432/postgres';

  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  console.log('Connecting to Supabase Database...');
  try {
    await client.connect();
    console.log('Connected successfully. Executing schema.sql...');
    await client.query(sql);
    console.log('Schema executed successfully. Database initialized!');
  } catch (err) {
    console.error('Database migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
