import Elysia, { t } from "elysia";
import db from "../../database";
import tables from "../../database/tables";

export default new Elysia({ prefix: "password" }).put(
    "/",
    async ({ body, status }) => {
        if (process.env.DEMO!) return status(403, { ok: false });

        let hashed = await Bun.password.hash(body.password);
        await db.update(tables.password).set({
            password: hashed,
        });

        return {
            ok: true,
        };
    },
    {
        body: t.Object({ password: t.String({ minLength: 3 }) }),
        auth: true,
    },
);
