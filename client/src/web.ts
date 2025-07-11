import Elysia from "elysia";
import { Logger } from "./utils/log";
import jwt from "@elysiajs/jwt";
import { html } from "@elysiajs/html";
import authRouter from "./web/routers/auth";
import pages from "./web/routers/pages";
import staticPlugin from "@elysiajs/static";
import bearer from "@elysiajs/bearer";
import authMacros from "./web/macros/auth";
import serversRouter from "./web/routers/servers";
import { websocket } from "./websocket";

const logger = Logger.get("web server");

export async function web() {
    const app = new Elysia()
        .use(html())
        .use(
            jwt({
                secret: process.env.JWT_SECRET!,
                exp: "7d",
            }),
        )
        .use(bearer())
        .use(staticPlugin({ assets: "src/web/public" }))
        .use(authMacros)
        .use(pages)
        .group("/api", (a) => a.use(authRouter).use(serversRouter))
        // @ts-ignore
        .ws("/websocket", websocket);

    app.listen(process.env.WEB_PORT!, (web) => {
        logger.info(`Web server running on ${web.hostname}:${web.port}`);
    });
}
