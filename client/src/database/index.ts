import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import path from "node:path";

const sqlite = new Database(process.env.DATABASE!);
const db = drizzle({ client: sqlite, casing: "snake_case" });

migrate(db, {
    migrationsFolder: path.join(__dirname, "../..", "drizzle"),
});

export default db;
