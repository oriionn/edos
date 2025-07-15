import { and, eq } from "drizzle-orm";
import db from "../database";
import tables from "../database/tables";
import type { WebsocketType } from "../models/websocket";

export async function isAuth(ws_type: WebsocketType, id: string) {
    let auth = await db
        .select()
        .from(tables.websockets)
        .where(
            and(
                eq(tables.websockets.id, id),
                eq(tables.websockets.type, ws_type),
                eq(tables.websockets.auth, true),
            ),
        );

    return auth.length !== 0;
}
