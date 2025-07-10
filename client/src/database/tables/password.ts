import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const password = sqliteTable("password", {
    password: text().notNull(),
});
