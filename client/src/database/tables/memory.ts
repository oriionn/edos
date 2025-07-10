import { sql } from "drizzle-orm";
import { int, sqliteTable } from "drizzle-orm/sqlite-core";

export const memory = sqliteTable("memory", {
    server_id: int().notNull(),
    free_hard: int().notNull(),
    total_hard: int().notNull(),
    free_swap: int().notNull(),
    total_swap: int().notNull(),
    date: int()
        .notNull()
        .default(sql`(unixepoch())`),
});
