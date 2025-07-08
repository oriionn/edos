import { DataType, type Message } from "./models/message";
import { cpuname } from "./socket/cpuname";
import { init } from "./socket/init";
import { Logger } from "./utils/log";

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
