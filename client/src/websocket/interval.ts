import { gte } from "drizzle-orm";
import db from "../database";
import tables from "../database/tables";
import { MessageType } from "../models/websocket";
import type { ServerWebSocket } from "elysia/ws/bun";

export async function interval(
    ws: ServerWebSocket,
    auth: Record<string, boolean>,
) {
    let servers = await db.select().from(tables.servers);

    let unixepoch = Math.floor(Date.now() / 1000);
    let serversAvailables = await db
        .select()
        .from(tables.servers)
        .where(gte(tables.servers.last_update, unixepoch - 10));

    let ids = [servers.map((s) => s.id), serversAvailables.map((s) => s.id)];

    ids[0]?.forEach((s) => {
        if (ids[1]?.includes(s)) {
            ws.send({
                type: MessageType.Availablity,
                data: `${s}_true`,
            });
        } else {
            ws.send({
                type: MessageType.Availablity,
                data: `${s}_false`,
            });
        }
    });
}
