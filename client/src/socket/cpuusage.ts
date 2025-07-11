import type { Socket } from "bun";
import type { SocketData } from "../socket";
import type { Message } from "../models/message";
import db from "../database";
import tables from "../database/tables";
import { getServerName, updated } from "../utils/server";
import { Logger } from "../utils/log";

const logger = Logger.get("tcp socket");

export async function cpuusage(socket: Socket<SocketData>, data: Message) {
    await db.insert(tables.cpu_usage).values({
        server_id: data.Id,
        usage: parseFloat(data.Data as string),
    });

    let serverName = await getServerName(data.Id);
    logger.debug("Server {server} sent the usage of its CPU", {
        server: serverName,
    });

    socket.write("true");
    updated(data.Id);
}
