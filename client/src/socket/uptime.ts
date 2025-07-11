import type { Socket } from "bun";
import type { SocketData } from "../socket";
import type { Message } from "../models/message";
import db from "../database";
import tables from "../database/tables";
import { getServerName, updated } from "../utils/server";
import { eq } from "drizzle-orm";
import { Logger } from "../utils/log";

const logger = Logger.get("tcp socket");

export async function uptime(socket: Socket<SocketData>, data: Message) {
    let uptimes = await db
        .select()
        .from(tables.uptime)
        .where(eq(tables.uptime.server_id, data.Id))
        .limit(1);

    if (uptimes.length === 0) {
        await db.insert(tables.uptime).values({
            server_id: data.Id,
            uptime: parseInt(data.Data as string),
        });
    } else {
        await db
            .update(tables.uptime)
            .set({ uptime: parseInt(data.Data as string) })
            .where(eq(tables.uptime.server_id, data.Id));
    }

    logger.debug("Server {server} sent its uptime", {
        server: await getServerName(data.Id),
    });

    socket.write("true");
    updated(data.Id);
}
