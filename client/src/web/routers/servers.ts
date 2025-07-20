import Elysia, { status, t } from "elysia";
import db from "../../database";
import tables from "../../database/tables";
import { eq } from "drizzle-orm";
import { generateToken } from "../../utils/key";
import { getMinIntervalData, getSecIntervalData } from "../../utils/server";

export default new Elysia({ prefix: "servers" })
    .get(
        "/",
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
        "/:id/token",
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
    )
    .post(
        "/",
        async ({ body }) => {
            if (process.env.DEMO!) return status(403, { ok: false });

            let server = await db
                .insert(tables.servers)
                .values({
                    name: body.name,
                })
                .returning();

            return {
                ok: true,
                data: { server },
            };
        },
        {
            body: t.Object({ name: t.String() }),
            auth: true,
        },
    )
    .get(
        "/:id/init",
        async ({ params: { id }, status }) => {
            const servers = await db
                .select()
                .from(tables.servers)
                .where(eq(tables.servers.id, id));

            if (servers.length === 0)
                return status(404, {
                    ok: false,
                    code: "SERVER_NOT_FOUND",
                });

            let sec = await getSecIntervalData(id);
            let min = await getMinIntervalData(id);

            let cpu_name = (
                await db
                    .select()
                    .from(tables.cpu_names)
                    .where(eq(tables.cpu_names.server_id, id))
                    .limit(1)
            )[0];

            return {
                ok: true,
                data: { ...sec, ...min, cpu_name: cpu_name?.name },
            };
        },
        {
            auth: true,
            params: t.Object({ id: t.Number() }),
        },
    )
    .delete(
        "/:id",
        async ({ params: { id } }) => {
            if (process.env.DEMO!) return status(403, { ok: false });

            const servers = await db
                .select()
                .from(tables.servers)
                .where(eq(tables.servers.id, id));

            if (servers.length === 0)
                return status(404, {
                    ok: false,
                    code: "SERVER_NOT_FOUND",
                });

            await db.delete(tables.servers).where(eq(tables.servers.id, id));
            await db
                .delete(tables.cpu_names)
                .where(eq(tables.cpu_names.server_id, id));
            await db
                .delete(tables.cpu_usage)
                .where(eq(tables.cpu_usage.server_id, id));
            await db.delete(tables.disks).where(eq(tables.disks.server_id, id));
            await db
                .delete(tables.memory)
                .where(eq(tables.memory.server_id, id));
            await db
                .delete(tables.network)
                .where(eq(tables.network.server_id, id));
            await db
                .delete(tables.uptime)
                .where(eq(tables.uptime?.server_id, id));

            return { ok: true };
        },
        {
            auth: true,
            params: t.Object({ id: t.Number() }),
        },
    );
