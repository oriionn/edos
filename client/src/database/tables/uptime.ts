import { sql } from "drizzle-orm";
import { int, sqliteTable } from "drizzle-orm/sqlite-core";

export const uptime = sqliteTable("uptime", {
    server_id: int().notNull().unique(),
    uptime: int().notNull(),
});
