import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const servers = sqliteTable("servers", {
    id: int().primaryKey({ autoIncrement: true }).unique(),
    name: text().notNull(),
    last_update: int()
        .notNull()
        .default(sql`(unixepoch())`),
});
