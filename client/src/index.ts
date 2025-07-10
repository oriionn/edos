import { startSocket } from "./socket";
import { clearDatabase } from "./utils/clear";
import { Logger } from "./utils/log";

await Logger.init();

await startSocket();
setInterval(clearDatabase, 600 * 1000);

// console.log("Hello via Bun!");
