const chart = document.getElementById("chart");

// Constants
const LETTER_RATIO = 8.5;
const PADDING = "    ";
const CHART_HEIGHT = 10;

// Testing function
function getRandomInt(min, max, quantity = 1) {
    return Array.from(
        { length: quantity },
        () => Math.floor(Math.random() * (max - min + 1)) + min,
    );
}

function getRandomFloat(min, max, decimals = 2, quantity = 1) {
    return Array.from({ length: quantity }, () =>
        Number((Math.random() * (max - min) + min).toFixed(decimals)),
    );
}

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

// Chart refresh
function refreshChart(name, dataset, isPercentage) {
    let element = document.getElementById(`chart_${name}`);

    let sets = [...dataset];
    sets = sets.slice(
        -((element.parentElement.clientWidth - 20) / LETTER_RATIO),
    );
    if (isPercentage) sets.push(100);

    let chart = asciichart.plot(sets, {
        height: CHART_HEIGHT,
        padding: PADDING + "  ",
        format: isPercentage
            ? function (x, i) {
                  return (PADDING + parseInt(x).toString()).slice(
                      -PADDING.length,
                  );
              }
            : undefined,
    });

    if (isPercentage) {
        console.log(chart);
        let chart_splitted = chart.split("\n");
        chart_splitted.forEach((line, i) => {
            chart_splitted[i] = line.slice(0, -2);
        });
        chart = chart_splitted.join("\n");
    }

    element.innerHTML = chart;
}

refreshChart("cpu", getRandomInt(1, 100, 500), true);
refreshChart("memory", getRandomInt(1, 100, 500), true);
refreshChart("upload", getRandomFloat(1, 500, 2, 500), false);
refreshChart("download", getRandomFloat(1, 500, 2, 500), false);
