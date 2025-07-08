import { sql } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const cpu_names = sqliteTable("cpu_name", {
    server_id: int().notNull().unique(),
    name: text().notNull(),
});

export const cpu_usage = sqliteTable("cpu_usage", {
    server_id: int().notNull(),
    usage: real().notNull(),
    date: int()
        .notNull()
        .default(sql`(unixepoch())`),
});
