import { input } from "@inquirer/prompts";
import db from "../src/database";
import tables from "../src/database/tables";

const name = await input({
    message: "Name : ",
    required: true,
});

await db.insert(tables.servers).values({ name });

console.log("Server created");
