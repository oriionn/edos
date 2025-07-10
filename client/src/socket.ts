import { cpu_usage } from "./database/schema";
import { DataType, type Message } from "./models/message";
import { cpuname } from "./socket/cpuname";
import { cpuusage } from "./socket/cpuusage";
import { disk } from "./socket/disk";
import { init } from "./socket/init";
import { memory } from "./socket/memory";
import { network } from "./socket/network";
import { uptime } from "./socket/uptime";
import { Logger } from "./utils/log";
import { getServerName } from "./utils/server";

export type SocketData = { auth: boolean; id: number | null };
const logger = Logger.get("tcp socket");

export async function startSocket() {
    let socket = Bun.listen<SocketData>({
        hostname: "0.0.0.0",
        port: process.env.SOCKET_PORT,
        socket: {
            // @ts-ignore
            async data(socket, rawData) {
                let data = rawData.toString();
                data = data.replaceAll("\n", "");

                let decoded: Message;
                try {
                    decoded = JSON.parse(data);
                } catch (e) {
                    return socket.write(`false`);
                }

                let serverName = await getServerName(decoded.Id);
                if (serverName === null) return socket.write("false");

                if (decoded.Type !== DataType.INIT) {
                    // @ts-ignore
                    if (!socket.auth) return socket.write("false");
                }

                switch (decoded.Type) {
                    case DataType.INIT:
                        init(socket, decoded);
                        break;
                    case DataType.CPU_NAME:
                        cpuname(socket, decoded);
                        break;
                    case DataType.CPU_USAGE:
                        cpuusage(socket, decoded);
                        break;
                    case DataType.DISK:
                        disk(socket, decoded);
                        break;
                    case DataType.UPTIME:
                        uptime(socket, decoded);
                        break;
                    case DataType.NETWORKS:
                        network(socket, decoded);
                        break;
                    case DataType.MEMORY:
                        memory(socket, decoded);
                        break;
                    default:
                        return socket.write("false");
                }
            },
            open(socket) {
                // @ts-ignore
                socket.auth = false;
                // @ts-ignore
                socket.id = null;
            },
            close(socket, error) {},
            drain(socket) {},
            error(socket, error) {},
        },
    });

    logger.info(`TCP Socket running on ${socket.hostname}:${socket.port}`);
}
