import { getFileSink } from "@logtape/file";
import { configure, getConsoleSink, getLogger } from "@logtape/logtape";
import { prettyFormatter } from "@logtape/pretty";

export const Logger = {
    init: async () => {
        await configure({
            sinks: {
                console: getConsoleSink({ formatter: prettyFormatter }),
                file: getFileSink("edos.log", {
                    lazy: true,
                }),
            },
            loggers: [
                {
                    category: "tcp socket",
                    sinks: ["console", "file"],
                },
                {
                    category: "database",
                    sinks: ["console", "file"],
                },
                {
                    category: ["logtape", "meta"],
                    sinks: [],
                },
            ],
        });
    },
    get: (logger: string) => {
        return getLogger([logger]);
    },
};
