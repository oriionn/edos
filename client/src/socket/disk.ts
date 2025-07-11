import type { Socket } from "bun";
import type { Disk, Message } from "../models/message";
import type { SocketData } from "../socket";
import db from "../database";
import tables from "../database/tables";
import { and, eq, sql } from "drizzle-orm";
import { Logger } from "../utils/log";
import { getServerName, updated } from "../utils/server";

const logger = Logger.get("tcp socket");

export async function disk(socket: Socket<SocketData>, data: Message) {
    let disk = data.Data as Disk;

    let devices = await db
        .select()
        .from(tables.disks)
        .where(
            and(
                eq(tables.disks.device, disk.Device),
                eq(tables.disks.server_id, data.Id),
            ),
        );

    if (devices.length === 0) {
        await db.insert(tables.disks).values({
            server_id: data.Id,
            device: disk.Device,
            name: disk.Name,
            free_size: disk.FreeSize,
            total_size: disk.TotalSize,
        });
    } else {
        await db
            .update(tables.disks)
            .set({
                name: disk.Name,
                free_size: disk.FreeSize,
                total_size: disk.TotalSize,
                last_update: sql`(unixepoch())`,
            })
            .where(
                and(
                    eq(tables.disks.device, disk.Device),
                    eq(tables.disks.server_id, data.Id),
                ),
            );
    }

    logger.debug("Server {server} sent infos its disk ({device})", {
        server: await getServerName(data.Id),
        device: disk.Device,
    });
    socket.write("true");
    updated(data.Id);
}
