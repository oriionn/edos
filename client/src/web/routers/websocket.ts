import Elysia, { t } from "elysia";
import { WebsocketType } from "../../models/websocket";
import db from "../../database";
import tables from "../../database/tables";

export default new Elysia({ prefix: "websocket" }).post(
    "/login",
    async ({ body }) => {
        await db.insert(tables.websockets).values({
            type: body.type,
            id: body.id,
            auth: true,
        });

        return {
            ok: true,
        };
    },
    {
        body: t.Object({
            type: t.Enum(WebsocketType),
            id: t.String(),
        }),
        auth: true,
    },
);
