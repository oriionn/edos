import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const servers = sqliteTable("servers", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull()
});
