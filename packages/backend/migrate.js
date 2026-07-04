import fs from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {client} from './src/db.ts'

async function migrate(){
    await client.connect();

    await client.query(`
        CREATE TABLE IF NOT EXISTS migrations (
            id SERIAL PRIMARY KEY,
            filename TEXT UNIQUE NOT NULL,
            executed_at TIMESTAMP DEFAULT NOW()
        );
    `);

    const applied = await client.query(
        "SELECT filename FROM migrations"
    );

    const appliedFiles = new Set(
        applied.rows.map(row => row.filename)
    )

    const migrationDir = fileURLToPath(
        new URL('./migrations', import.meta.url)
    )
    const files = fs.readdirSync(migrationDir).filter(file => file.endsWith('.sql')).sort()

    for (const file of files) {

        if (appliedFiles.has(file)) {
            console.log(`Skipping ${file}`);
            continue;
        }

        console.log(`Running ${file}`);

        const sql = fs.readFileSync(
            path.join(migrationDir, file),
            "utf8"
        );

        try {

            await client.query("BEGIN");

            await client.query(sql);

            await client.query(
                "INSERT INTO migrations(filename) VALUES($1)",
                [file]
            );

            await client.query("COMMIT");

            console.log(`${file} completed`);

        } catch (err) {

            await client.query("ROLLBACK");

            console.error(`${file} failed`);
            console.error(err.message);

            process.exit(1);
        }
    }

    await client.end();

    console.log("Database is up to date.");
}

migrate();
