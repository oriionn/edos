import { gte } from "drizzle-orm";
import db from "../../database";
import tables from "../../database/tables";
import {
    MainMessageType as MessageType,
    WebsocketType,
} from "../../models/websocket";
import type { ServerWebSocket } from "elysia/ws/bun";
import { isAuth } from "../auth";

export async function interval(ws: ServerWebSocket) {
    // @ts-ignore
    if (!(await isAuth(WebsocketType.SERVERS, ws.id))) return;

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
                // @ts-ignore
                type: MessageType.Availablity,
                data: `${s}_true`,
            });
        } else {
            ws.send({
                // @ts-ignore
                type: MessageType.Availablity,
                data: `${s}_false`,
            });
        }
    });
}
