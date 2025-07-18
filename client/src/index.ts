import db from "./database";
import tables from "./database/tables";
import { startSocket } from "./socket";
import { clearDatabase } from "./utils/clear";
import { Logger } from "./utils/log";
import { web } from "./web";

await Logger.init();

const logger = Logger.get("database");
let passwords = await db.select().from(tables.password);
if (passwords.length === 0) {
    logger.info("New instance detected");
    let hashedPassword = await Bun.password.hash("admin");
    await db.insert(tables.password).values({ password: hashedPassword });
    logger.warn(`Default password : {password}`, { password: "admin" });
} else {
    let password = passwords[0]?.password;
    if ((await Bun.password.verify("admin", password!)) && !process.env.DEMO!) {
        logger.warn`Default password detected, please change it`;
        logger.warn(`Default password : {password}`, { password: "admin" });
    }
}

await startSocket();
await web();
setInterval(clearDatabase, 600 * 1000);

// console.log("Hello via Bun!");
