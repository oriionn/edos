import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const cpu_names = sqliteTable("cpu_name", {
    id: int().notNull().unique(),
    name: text().notNull(),
});
