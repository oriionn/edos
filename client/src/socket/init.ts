import type { Socket } from "bun";
import type { Message } from "../models/message";
import { generateKey } from "../utils/key";
import type { SocketData } from "../socket";
import { Logger } from "../utils/log";
import db from "../database";
import tables from "../database/tables";
import { eq } from "drizzle-orm";
import { getServerName, updated } from "../utils/server";

const logger = Logger.get("tcp socket");

export async function init(socket: Socket<SocketData>, data: Message) {
    let key = data.Data as string;
    let generated = await generateKey(data.Id);

    let serverName = await getServerName(data.Id);

    if (serverName === null) {
        logger.info(
            "The server with identifier {id} has tried to connect, but does not exist in our database.",
            { id: data.Id },
        );
        return socket.write("false");
    }

    if (key === generated) {
        // @ts-ignore
        socket.auth = true;
        // @ts-ignore
        socket.id = data.Id;
        socket.write("true");
        logger.info(`Server {name} authentificated`, { name: serverName });
    } else {
        socket.write("false");
        logger.info(`{name}'s authentification failed'`, {
            name: serverName,
        });
    }
    updated(data.Id);
}
