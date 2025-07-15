import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const websockets = sqliteTable("websockets", {
    type: text({ enum: ["server", "servers"] }).notNull(),
    id: text().notNull(),
    auth: int({ mode: "boolean" }),
});
