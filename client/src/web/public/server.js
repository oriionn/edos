const returnButton = document.getElementById("return");
const cpuNameSpan = document.getElementById("cpu_name");
const ratioMemorySpan = document.getElementById("memory_ratio");
const ratioSwapSpan = document.getElementById("swap_ratio");
const disksTable = document.getElementById("disks");
const statsContainer = document.getElementById("stats");

returnButton.addEventListener("click", () => {
    window.location.href = "/";
});

// Constants
const LETTER_RATIO = 8;
const PADDING = "    ";
const CHART_HEIGHT = 10;
const MessageType = {
    Login: 0,
    SecInterval: 2,
    MinInterval: 3,
};

// Detect new lines from flex wrap
function detectWrap(className) {
    const wrapped = [];
    const items = document.getElementsByClassName(className);
    let prevRect = null;

    for (let el of items) {
        const rect = el.getBoundingClientRect();
        if (prevRect && rect.top > prevRect.top + 1) {
            wrapped.push(el);
        }
        prevRect = rect;
    }
    return wrapped;
}

function resetWrap(className) {
    const items = document.getElementsByClassName(className);
    for (let el of items) {
        el.classList.remove("wrapped");
    }
}

function triggerWrap() {
    resetWrap("container");
    const wr = detectWrap("container");
    wr.forEach((el) => el.classList.add("wrapped"));
}

triggerWrap();
window.addEventListener("resize", () => triggerWrap());

function datasetSliceLength(name, isPercentage = false) {
    let element = document.getElementById(`chart_${name}`);

    return isPercentage
        ? -((element.parentElement.clientWidth - 20) / LETTER_RATIO)
        : -((element.parentElement.clientWidth - 50) / LETTER_RATIO);
}

// Chart refresh
function refreshChart(name, dataset, isPercentage, prefix = null) {
    let element = document.getElementById(`chart_${name}`);

    let sets = [...dataset];
    sets = sets.slice(datasetSliceLength(name, isPercentage));
    if (isPercentage) {
        sets.push(100);
        sets.push(0);
    }

    let chart = asciichart.plot(sets, {
        height: CHART_HEIGHT,
        padding: PADDING + "  ",
        format: isPercentage
            ? function (x, i) {
                  return (PADDING + parseInt(x).toString() + "%").slice(
                      -PADDING.length,
                  );
              }
            : function (x, i) {
                  return (
                      PADDING +
                      "      " +
                      parseFloat(x).toFixed(2) +
                      " " +
                      prefix
                  ).slice(-(PADDING + "      ").length);
              },
    });

    if (isPercentage) {
        let chart_splitted = chart.split("\n");
        chart_splitted.forEach((line, i) => {
            chart_splitted[i] = line.slice(0, -3);
        });
        chart = chart_splitted.join("\n");
    }

    element.innerHTML = chart;
}

// Bytes to bibytes
const bibytePrefixes = ["", "Ki", "Mi", "Gi", "Ti", "Pi", "Ei", "Zi", "Yi"];
function bytesToBibytes(bytes, unit = null) {
    const base = 1024;

    if (bytes === 0) return { formattedValue: "0", prefix: "B" };

    // Si une unité spécifique est demandée
    if (unit) {
        const prefixIndex = bibytePrefixes.findIndex(
            (prefix) => prefix === unit,
        );
        if (prefixIndex === -1) {
            throw new Error(`Invalid unit`);
        }

        const value = bytes / Math.pow(base, prefixIndex);
        const formattedValue =
            value >= 100 ? value.toFixed(1) : value.toFixed(2);
        return { formattedValue, prefix: `${unit}B` };
    }

    // Comportement original si aucune unité n'est spécifiée
    const exponent = Math.floor(Math.log(bytes) / Math.log(base));
    const prefixIndex = Math.min(exponent, bibytePrefixes.length - 1);
    const value = bytes / Math.pow(base, prefixIndex);
    const formattedValue = value >= 100 ? value.toFixed(1) : value.toFixed(2);

    return { formattedValue, prefix: `${bibytePrefixes[prefixIndex]}B` };
}

function getBiggestUnit(dataset) {
    let mapped = dataset.map((d) => bytesToBibytes(d).prefix);
    mapped = mapped.map((d) =>
        bibytePrefixes.findIndex((prefix) => prefix === d.slice(0, -1)),
    );

    let max = Math.max(...mapped);
    return bibytePrefixes[max];
}

/* refreshChart("cpu", getRandomInt(1, 100, 500), true);
refreshChart("memory", getRandomInt(1, 100, 500), true);
refreshChart("upload", getRandomFloat(1, 500, 2, 500), false);
refreshChart("download", getRandomFloat(1, 500, 2, 500), false); */

function refreshCurrent(type, data, bytes = false) {
    let el = document.getElementById(`current_${type}`);
    if (bytes) {
        let converted = bytesToBibytes(data);
        el.innerHTML = `${converted.formattedValue} ${converted.prefix}`;
    } else {
        el.innerHTML = `${data}%`;
    }
}

function refreshDisks(disks) {
    disksTable.innerHTML = "";
    disks
        .sort()
        .reverse()
        .forEach((disk) => {
            if (disk.name === disk.device) return;

            let percentage = ((disk.free_size / disk.total_size) * 100).toFixed(
                2,
            );
            let formatted_free = bytesToBibytes(disk.free_size);
            let formatted_total = bytesToBibytes(disk.total_size);

            let formatted = `${formatted_free.formattedValue} ${formatted_free.prefix} / ${formatted_total.formattedValue} ${formatted_total.prefix}`;
            disksTable.innerHTML += `<tr>
            <td>${disk.name}</td>
            <td class="usage">${percentage}% (${formatted})</td>
        </tr>`;
        });
}

const ws = new WebSocket("/websocket/" + id);
ws.onmessage = (message) => {
    try {
        let data = JSON.parse(message.data);
        switch (data.type) {
            case MessageType.Login:
                fetch("/api/websocket/login", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data.data),
                });
                break;
            case MessageType.SecInterval:
                refreshSec(data.data);
                break;
            case MessageType.MinInterval:
                refreshDisks(data.data.disks);
                break;
            default:
                console.log(data);
                break;
        }
    } catch {
        return;
    }
};

async function refreshSec(d) {
    if (d.cpu.current === undefined || d.memory.current === undefined)
        return statsContainer.classList.add("no-data");
    statsContainer.classList.remove("no-data");

    refreshCurrent("cpu", d.cpu.current);
    refreshCurrent("memory", d.memory.current.num);
    refreshCurrent("swap", d.swap.current.num);
    refreshCurrent("upload", d.upload.current, true);
    refreshCurrent("download", d.download.current, true);

    let used_memory = bytesToBibytes(
        d.memory.current.total - d.memory.current.free,
    );
    let total_memory = bytesToBibytes(d.memory.current.total);
    ratioMemorySpan.innerHTML = `${used_memory.formattedValue} ${used_memory.prefix} / ${total_memory.formattedValue} ${total_memory.prefix}`;

    let used_swap = bytesToBibytes(d.swap.current.total - d.swap.current.free);
    let total_swap = bytesToBibytes(d.swap.current.total);
    ratioSwapSpan.innerHTML = `${used_swap.formattedValue} ${used_swap.prefix} / ${total_swap.formattedValue} ${total_swap.prefix}`;

    refreshChart("cpu", d.cpu.datasets, true);
    refreshChart(
        "memory",
        d.memory.datasets.map((d) => d.num),
        true,
    );

    refreshChart(
        "swap",
        d.swap.datasets.map((d) => d.num),
        true,
    );

    let uploadBiggestUnit = getBiggestUnit(
        d.upload.datasets.slice(datasetSliceLength("upload", false)),
    );
    refreshChart(
        "upload",
        d.upload.datasets.map((d) =>
            Number(bytesToBibytes(d, uploadBiggestUnit).formattedValue),
        ),
        false,
        uploadBiggestUnit + "B",
    );

    let downloadBiggestUnit = getBiggestUnit(
        d.download.datasets.slice(datasetSliceLength("download", false)),
    );
    refreshChart(
        "download",
        d.download.datasets.map((d) =>
            Number(bytesToBibytes(d, downloadBiggestUnit).formattedValue),
        ),
        false,
        downloadBiggestUnit + "B",
    );
}

async function load() {
    let res = await fetch(`/api/servers/${id}/init`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!res.ok) {
        window.location.href = "/";
        return;
    }

    let data = await res.json();
    if (!data.ok) {
        window.location.href = "/";
        return;
    }

    let d = data.data;

    cpuNameSpan.innerHTML = d.cpu_name;
    refreshDisks(d.disks);
    refreshSec(d);
}

load();
