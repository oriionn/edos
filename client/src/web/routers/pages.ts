import Elysia, { t, NotFoundError } from "elysia";
import db from "../../database";
import tables from "../../database/tables";
import { eq } from "drizzle-orm";
import not_found from "../pages/not_found.html";

export async function render(page: string) {
    let html = await Bun.file(`src/web/pages/${page}.html`).text();
    if (process.env.DEMO!) html = html.replaceAll("{demo}", "demo");
    else html = html.replaceAll("{demo}", "");
    return html;
}

export default new Elysia()
    .get("/login", async () => {
        let html = await render("auth");
        if (process.env.DEMO!)
            html = html.replace(
                "{text-demo}",
                "⚠️ This is a demo instance, you can enter any password.",
            );
        else html = html.replace("{text-demo}", "");

        return html;
    })
    .get("/", async () => {
        return await render("index");
    })
    .group("/servers", (group) =>
        group
            .get("/new", async ({ status }) => {
                if (process.env.DEMO!)
                    return status(404, await render("not_found"));
                return await render("create");
            })
            .get(
                "/:id",
                async ({ params }) => {
                    let server = await db
                        .select()
                        .from(tables.servers)
                        .where(eq(tables.servers.id, params.id));

                    if (server.length === 0) return "Server doesn't exist";

                    let html = await render("server");
                    html = html.replaceAll("{name}", server[0]?.name!);
                    html = html.replaceAll("{ id }", params.id.toString());

                    return html;
                },
                {
                    params: t.Object({ id: t.Number() }),
                },
            ),
    )
    .get("/password/new", async ({ status }) => {
        if (process.env.DEMO!) return status(404, await render("not_found"));
        return await render("password");
    });
