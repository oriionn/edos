import { sql } from "drizzle-orm";
import { int, sqliteTable } from "drizzle-orm/sqlite-core";

export const network = sqliteTable("network", {
    server_id: int().notNull(),
    upload_sec: int().notNull(),
    download_sec: int().notNull(),
    upload_all: int().notNull(),
    download_all: int().notNull(),
    date: int()
        .notNull()
        .default(sql`(unixepoch())`),
});
