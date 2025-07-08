import { select } from "@inquirer/prompts";
import db from "../src/database";
import tables from "../src/database/tables";
import { generateKey, generateToken } from "../src/utils/key";

let servers = await db.select().from(tables.servers);

let id = await select({
    message: "Which server to make a token ?",
    choices: servers.map((server) => ({
        name: server.name,
        value: server.id,
    })),
});

console.log(`Key: ${await generateKey(id)}`);
console.log(`Token: ${await generateToken(id)}`);
