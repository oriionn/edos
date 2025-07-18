import type { ServerWebSocket } from "elysia/ws/bun";
import { isAuth } from "../auth";
import {
    ServerMessageType as MessageType,
    WebsocketType,
} from "../../models/websocket";
import { getMinIntervalData, getSecIntervalData } from "../../utils/server";

export async function interval_sec(ws: ServerWebSocket) {
    // @ts-ignore
    if (!isAuth(WebsocketType.SERVER, ws.id)) return;

    // @ts-ignore
    let data = await getSecIntervalData(ws!.data!.params!.id);

    ws.send({
        // @ts-ignore
        type: MessageType.SecInterval,
        data,
    });
}

export async function interval_min(ws: ServerWebSocket) {
    // @ts-ignore
    if (!isAuth(WebsocketType.SERVER, ws.id)) return;

    // @ts-ignore
    let data = await getMinIntervalData(ws!.data!.params!.id);

    ws.send({
        // @ts-ignore
        type: MessageType.MinInterval,
        data,
    });
}
