import { t, type Context } from "elysia";
import type { WebSocketHandler } from "elysia/ws/bun";
import { ServerMessageType as MessageType } from "../../models/websocket";

export const websocket: Partial<WebSocketHandler<Context>> = {
    body: t.Object({
        type: t.Enum(MessageType),
        data: t.String(),
    }),
    params: t.Object({
        id: t.Number(),
    }),
    async message(ws, { type, data }) {
        let id = ws.data.params.id;
    },
};
