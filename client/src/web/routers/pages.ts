import Elysia from "elysia";

async function render()

export default new Elysia()
    .get("/login", async () => {
        let html = await Bun.file("src/web/pages/auth.html").text();
        return html;
    })
    .get("/", async () => {
        let html = await Bun.file("src/web/pages/index.html").text();
        return html;
    })
    .group("/servers", (group) =>
        group.get("/new", async () => {
            let html = await Bun.file("src/web/pages/create.html").text();
            return html;
        }),
    );
