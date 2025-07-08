import { eq } from "drizzle-orm";
import db from "../database";
import tables from "../database/tables";

export async function getServerName(id: number) {
    let info = await db
        .select()
        .from(tables.servers)
        .where(eq(tables.servers.id, id))
        .limit(1);
    
    if (info.length === 0) {
        return null;
    }
    
    return info[0]?.name;
}
