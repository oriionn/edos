import Elysia from "elysia";

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
        group.get("/new", async () => {
            return await render("create");
        }),
    )
    .get("/password/new", async () => {
        return await render("password");
    });
