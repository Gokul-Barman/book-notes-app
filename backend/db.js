import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Check if we are in production (Render) or local
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Only use SSL settings when on Render/Production
  ssl: isProduction ? { rejectUnauthorized: false } : false
});
export default pool;

