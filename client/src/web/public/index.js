const servers = document.getElementById("servers");
const modalTokenInput = document.getElementById("modal-token");
const modalTokenCopy = document.getElementById("copy-modal-token");
const modalMessage = document.getElementById("modal-message");
const modalClose = document.getElementById("modal-close");
const modal = document.getElementById("modal");

const MessageType = {
    Login: 0,
    Availability: 2,
};

modalTokenCopy.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(modalTokenInput.value);
        modalMessage.innerHTML =
            "✅ The token has been successfully copied and pasted";
    } catch (err) {
        modalMessage.innerHTML = "❌ An error occurred while copying the token";
        console.error(err);
    }
});

modalClose.addEventListener("click", async () => {
    modal.classList.remove("visible");
});

async function token(id) {
    let res = await fetch(`/api/servers/${id}/token`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!res.ok) return;

    let data = await res.json();
    modalTokenInput.value = data.data.token;
    modal.classList.add("visible");
}

async function deleteServer(id) {
    let res = await fetch(`/api/servers/${id}`, {
        method: "delete",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!res.ok);
    document.querySelector(`.server[data-id="${id}"]`).remove();
}

const ws = new WebSocket("/websocket");
ws.onopen = load;
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
            case MessageType.Availability:
                let [id, rawAvailability] = data.data.split("_");
                let availabity = rawAvailability === "true";
                if (availabity) {
                    document
                        .querySelector(`circle-icon[data-id="${id}"]`)
                        .classList.add("online");
                } else {
                    document
                        .querySelector(`circle-icon[data-id="${id}"]`)
                        .classList.remove("online");
                }
                break;
            default:
                console.log(data);
                break;
        }
    } catch {
        return;
    }
};

async function load() {
    let token = localStorage.getItem("token");

    res = await fetch(`/api/servers`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.status !== 200) {
        window.location.href = "/login";
        return;
    }

    ws.send(
        JSON.stringify({
            type: MessageType.Login,
            data: token,
        }),
    );

    data = await res.json();
    let unixepoch = Math.floor(Date.now() / 1000);

    data.data.servers.forEach((server) => {
        servers.innerHTML =
            `<div class="server" data-id="${server.id}">
            <a href="/servers/${server.id}">${server.name}</a>
            <div class="actions">
                <div class="token" onclick="token(${server.id})">
                    <key-icon />
                </div>

                <div class="delete" onclick="deleteServer(${server.id})">
                    <trash-icon />
                </div>

                <circle-icon class="status ${server.last_update >= unixepoch - 10 ? "online" : ""}" data-id="${server.id}" />
            </div>
        </div>` + servers.innerHTML;
    });
}

async function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
}
