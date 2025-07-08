import { startSocket } from "./socket";
import { Logger } from "./utils/log";

await Logger.init();
await startSocket();

// console.log("Hello via Bun!");
