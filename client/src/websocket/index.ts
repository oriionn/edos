import { t, type Context } from "elysia";
import type { WebSocketHandler } from "elysia/ws/bun";
import { MessageType } from "../models/websocket";
import { jwtVerify } from "jose";
import db from "../database";
import tables from "../database/tables";
import { gte } from "drizzle-orm";
import { interval } from "./interval";

const auth: Record<string, boolean> = {};
const intervals: Record<string, NodeJS.Timeout> = {};

export const websocket: Partial<WebSocketHandler<Context>> = {
    body: t.Object({
        type: t.Enum(MessageType),
        data: t.String(),
    }),
    // @ts-ignore
    async message(ws, { type, data }) {
        switch (type) {
            case MessageType.Login:
                const encodedKey = new TextEncoder().encode(
                    process.env.JWT_SECRET!,
                );

                try {
                    const token = await jwtVerify(data, encodedKey);
                    // @ts-ignore
                    auth[ws.id] = true;
                    return ws.send({
                        type: MessageType.Login,
                        data: true,
                    });
                } catch {
                    // @ts-ignore
                    auth[ws.id] = false;
                    return ws.send({
                        type: MessageType.Login,
                        data: false,
                    });
                }
                break;
            default:
                return ws.send({
                    type: MessageType.Unknown,
                    data: true,
                });
                break;
        }
    },
    async open(ws) {
        await interval(ws);
        intervals[ws.id] = setInterval(async () => {
            await interval(ws);
        }, 5000);
    },
    close(ws) {
        clearInterval(intervals[ws.id]);
    },
};
