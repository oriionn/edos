import Elysia from "elysia";

export default new Elysia()
    .get("/login", async () => {
        let html = await Bun.file("src/web/pages/auth.html").text();
        return html;
    })
    .get("/", async () => {
        let html = await Bun.file("src/web/pages/index.html").text();
        return html;
    });
