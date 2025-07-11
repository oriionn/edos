import Elysia, { status, t } from "elysia";
import db from "../../database";
import tables from "../../database/tables";
import { eq } from "drizzle-orm";
import { generateToken } from "../../utils/key";

export default new Elysia()
    .get(
        "/servers",
        async () => {
            const servers = await db.select().from(tables.servers);
            return {
                ok: true,
                data: {
                    servers,
                },
            };
        },
        { auth: true },
    )
    .get(
        "/servers/:id/token",
        async ({ params: { id } }) => {
            const servers = await db
                .select()
                .from(tables.servers)
                .where(eq(tables.servers.id, id));

            if (servers.length === 0)
                return status(404, {
                    ok: false,
                    code: "SERVER_NOT_FOUND",
                });

            let token = await generateToken(id);
            return {
                ok: true,
                data: {
                    token,
                },
            };
        },
        {
            params: t.Object({ id: t.Number() }),
            auth: true,
        },
    );
