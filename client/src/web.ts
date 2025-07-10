import Elysia from "elysia";
import { Logger } from "./utils/log";
import jwt from "@elysiajs/jwt";
import { html } from "@elysiajs/html";
import authRouter from "./web/routers/auth";
import pages from "./web/routers/pages";
import staticPlugin from "@elysiajs/static";

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
        .use(staticPlugin({ assets: "src/web/public" }))
        .use(pages)
        .group("/api", (a) => a.use(authRouter));

    app.listen(process.env.WEB_PORT!, (web) => {
        logger.info(`Web server running on ${web.hostname}:${web.port}`);
    });
}
