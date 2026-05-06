const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function test() {
    try {
        const res = await pool.query('SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = \'public\'');
        console.log('Tables in database:', res.rows.map(r => r.tablename));
        await pool.end();
    } catch (err) {
        console.error('Test failed:', err.message);
        process.exit(1);
    }
}

test();
