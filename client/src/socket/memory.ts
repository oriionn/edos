import type { Socket } from "bun";
import type { Message } from "../models/message";
import type { SocketData } from "../socket";
import db from "../database";
import tables from "../database/tables";
import { Logger } from "../utils/log";
import { getServerName, updated } from "../utils/server";

const logger = Logger.get("tcp socket");

export async function memory(socket: Socket<SocketData>, data: Message) {
    let splitted = (data.Data as string).split(";");
    if (splitted.length !== 4) return socket.write("false");

    let [total_hard, free_hard, total_swap, free_swap] = splitted.map((s) =>
        parseInt(s),
    );

    await db.insert(tables.memory).values({
        // @ts-ignore
        server_id: data.Id,
        total_hard,
        free_hard,
        total_swap,
        free_swap,
    });

    logger.debug("Server {server} sent its memory stats", {
        server: await getServerName(data.Id),
    });

    socket.write("true");
    updated(data.Id);
}
