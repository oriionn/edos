import Elysia from "elysia";
import db from "../../database";
import tables from "../../database/tables";

export default new Elysia().get(
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
);
