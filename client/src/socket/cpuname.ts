import type { Socket } from "bun";
import type { SocketData } from "../socket";
import type { Message } from "../models/message";
import db from "../database";
import tables from "../database/tables";
import { eq } from "drizzle-orm";
import { getServerName } from "../utils/server";
import { Logger } from "../utils/log";

const logger = Logger.get("tcp socket");

export async function cpuname(socket: Socket<SocketData>, data: Message) {
    let names = await db
        .select()
        .from(tables.cpu_names)
        .where(eq(tables.cpu_names.server_id, data.Id))
        .limit(1);

    if (names.length === 0) {
        await db
            .insert(tables.cpu_names)
            .values({ server_id: data.Id, name: data.Data as string });
    } else {
        await db
            .update(tables.cpu_names)
            .set({ name: data.Data as string })
            .where(eq(tables.cpu_names.server_id, data.Id));
    }

    let serverName = await getServerName(data.Id);
    logger.debug("Server {server} sent the name of its CPU", {
        server: serverName,
    });

    socket.write("true");
}
