import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const disks = sqliteTable("disks", {
    server_id: int().notNull(),
    device: text().notNull(),
    name: text().notNull(),
    free_size: int().notNull(),
    total_size: int().notNull(),
    last_update: int()
        .notNull()
        .default(sql`(unixepoch())`),
});
