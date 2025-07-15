import { t, type Context } from "elysia";
import type { WebSocketHandler } from "elysia/ws/bun";
import {
    MainMessageType as MessageType,
    WebsocketType,
} from "../../models/websocket";
import { interval } from "./interval";
import db from "../../database";
import tables from "../../database/tables";
import { eq } from "drizzle-orm";

const intervals: Record<string, NodeJS.Timeout> = {};

export const websocket: Partial<WebSocketHandler<Context>> = {
    // @ts-ignore
    body: t.Object({
        type: t.Enum(MessageType),
        data: t.String(),
    }),
    async close(ws) {
        // @ts-ignore
        clearInterval(intervals[ws.id]);

        await db
            .delete(tables.websockets)
            // @ts-ignore
            .where(eq(tables.websockets.id, ws.id));
    },
    async open(ws) {
        ws.send({
            // @ts-ignore
            type: MessageType.Login,
            data: {
                // @ts-ignore
                id: ws.id,
                type: WebsocketType.SERVERS,
            },
        });

        // @ts-ignore
        await interval(ws);
        // @ts-ignore
        intervals[ws.id] = setInterval(async () => {
            // @ts-ignore
            await interval(ws);
        }, 5000);
    },
};
