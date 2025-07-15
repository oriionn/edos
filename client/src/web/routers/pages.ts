import Elysia, { t } from "elysia";
import db from "../../database";
import tables from "../../database/tables";
import { eq } from "drizzle-orm";

async function render(page: string) {
    let html = await Bun.file(`src/web/pages/${page}.html`).text();
    return html;
}

export default new Elysia()
    .get("/login", async () => {
        return await render("auth");
    })
    .get("/", async () => {
        return await render("index");
    })
    .group("/servers", (group) =>
        group
            .get("/new", async () => {
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

                    let html = await Bun.file(
                        "src/web/pages/server.html",
                    ).text();
                    html = html.replaceAll("{name}", server[0]?.name!);
                    html = html.replaceAll("{id}", params.id.toString());

                    return html;
                },
                {
                    params: t.Object({ id: t.Number() }),
                },
            ),
    )
    .get("/password/new", async () => {
        return await render("password");
    });
