import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { db } from '../src/config/database.config';

async function initDb() {
    console.log('🚀 Starting database initialization...');

    const fresh = process.argv.includes('--fresh');
    const sqlPath = path.join(__dirname, '../database/dump.sql');

    if (!fs.existsSync(sqlPath)) {
        console.error(`❌ Error: ${sqlPath} not found.`);
        process.exit(1);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');
    const statements = sql
        .split(';') // simple split by semicolon, can be improved for complex dumps
        .map(s => s.trim())
        .filter(s => s.length > 0);

    try {
        const connection = await db.getConnection();

        if (fresh) {
            console.log('🧹 Fresh mode: Scanning for tables to drop...');

            // match table names in CREATE TABLE statements
            const tableMatches = sql.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?(\w+)[`"]?/gi);
            const tablesToDrop = [...new Set([...tableMatches].map(m => m[1]))];

            for (const table of tablesToDrop) {
                console.log(`🗑️  Dropping table: ${table}`);
                await connection.query(`DROP TABLE IF EXISTS \`${table}\`;`);
            }
        } else {
            console.info('💡 Safe mode: Existing data will be preserved...');
        }

        console.log(`📜 Executing ${statements.length} SQL statements...`);
        for (const statement of statements) {
            await connection.query(statement);
        }

        connection.release();
        console.log('✅ Database initialized successfully!');
    } catch (err) {
        console.error('❌ Database initialization failed:', err);
    } finally {
        process.exit(0);
    }
}

initDb();
