import type { Socket } from "bun";
import type { Message } from "../models/message";
import type { SocketData } from "../socket";
import db from "../database";
import tables from "../database/tables";
import { Logger } from "../utils/log";
import { getServerName } from "../utils/server";

const logger = Logger.get("tcp socket");

export async function network(socket: Socket<SocketData>, data: Message) {
    let splitted = (data.Data as string).split(";");
    if (splitted.length !== 4) return socket.write("false");

    let [download_sec, upload_sec, download_all, upload_all] = splitted.map(
        (s) => parseInt(s),
    );

    await db.insert(tables.network).values({
        // @ts-ignore
        server_id: data.Id,
        upload_sec,
        download_sec,
        upload_all,
        download_all,
    });

    logger.info("Server {server} sent its network's stats", {
        server: await getServerName(data.Id),
    });

    socket.write("true");
}
