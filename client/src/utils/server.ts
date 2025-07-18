import { and, asc, eq, gte, sql } from "drizzle-orm";
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

export async function updated(id: number) {
    await db
        .update(tables.servers)
        .set({ last_update: sql`(unixepoch())` })
        .where(eq(tables.servers.id, id));
}

export async function getSecIntervalData(id: number) {
    let unixepoch = Math.floor(Date.now() / 1000);

    let raw_cpu_usages = await db
        .select()
        .from(tables.cpu_usage)
        .where(
            and(
                gte(tables.cpu_usage.date, unixepoch - 150),
                eq(tables.cpu_usage.server_id, id),
            ),
        )
        .orderBy(asc(tables.cpu_usage.date));

    let raw_networks = await db
        .select()
        .from(tables.network)
        .where(
            and(
                gte(tables.network.date, unixepoch - 150),
                eq(tables.network.server_id, id),
            ),
        )
        .orderBy(asc(tables.network.date));

    let raw_memory = await db
        .select()
        .from(tables.memory)
        .where(
            and(
                gte(tables.memory.date, unixepoch - 150),
                eq(tables.memory.server_id, id),
            ),
        )
        .orderBy(asc(tables.memory.date));

    let cpu_usages = raw_cpu_usages.map((data) => data.usage);
    let memory = raw_memory.map((data) => ({
        num: Number(
            (
                ((data.total_hard - data.free_hard) / data.total_hard) *
                100
            ).toFixed(2),
        ),
        free: data.free_hard,
        total: data.total_hard,
    }));
    let swap = raw_memory.map((data) => ({
        num: Number(
            (
                ((data.total_swap - data.free_swap) / data.total_swap) *
                100
            ).toFixed(2),
        ),
        free: data.free_swap,
        total: data.total_swap,
    }));
    let download = raw_networks.map((data) => data.download_sec);
    let upload = raw_networks.map((data) => data.upload_sec);

    let current_cpu_usage = cpu_usages[cpu_usages.length - 1];
    let current_memory = memory[memory.length - 1];
    let current_swap = swap[swap.length - 1];
    let current_download = download[download.length - 1];
    let current_upload = upload[upload.length - 1];

    const data = {
        cpu: {
            current: current_cpu_usage,
            datasets: cpu_usages,
        },
        memory: {
            current: current_memory,
            datasets: memory,
        },
        swap: {
            current: current_swap,
            datasets: swap,
        },
        download: {
            current: current_download,
            datasets: download,
        },
        upload: {
            current: current_upload,
            datasets: upload,
        },
    };

    return data;
}

export async function getMinIntervalData(id: number) {
    let unixepoch = Math.floor(Date.now() / 1000);

    let disks = await db
        .select()
        .from(tables.disks)
        .where(
            and(
                eq(tables.disks.server_id, id),
                gte(tables.disks.last_update, unixepoch - 180),
            ),
        );

    return {
        disks: disks,
    };
}
