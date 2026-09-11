import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('DATABASE_URL is not defined in server/.env');
  process.exit(1);
}

console.log('Connecting to database...');
const pool = new Pool({ connectionString: dbUrl });

async function init() {
  try {
    const schemaPath = path.resolve(__dirname, '../src/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Applying schema.sql...');
    await pool.query(schemaSql);
    console.log('Schema applied successfully!');

    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Public tables in database:', res.rows.map(r => r.table_name));

    await pool.end();
    console.log('Database initialization completed.');
  } catch (err) {
    console.error('Database initialization failed:', err);
    await pool.end();
    process.exit(1);
  }
}

init();
