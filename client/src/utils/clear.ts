import { lt, sql } from "drizzle-orm";
import db from "../database";
import tables from "../database/tables";
import { Logger } from "./log";

const logger = Logger.get("database");

export async function clearDatabase() {
    let unixepoch = Math.floor(Date.now() / 1000);
    await db
        .delete(tables.network)
        .where(lt(tables.network.date, unixepoch - 600));

    await db
        .delete(tables.memory)
        .where(lt(tables.memory.date, unixepoch - 600));

    await db
        .delete(tables.cpu_usage)
        .where(lt(tables.cpu_usage.date, unixepoch - 600));

    logger.info(`Database cleared`);
}
