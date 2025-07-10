import Elysia from "elysia";
import { Logger } from "./utils/log";

const logger = Logger.get("web server");

export async function web() {
    const app = new Elysia().get("/", "Hello World");

    app.listen(process.env.WEB_PORT!, (web) => {
        logger.info(`Web server running on ${web.hostname}:${web.port}`);
    });
}
