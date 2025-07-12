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

const ws = new WebSocket("/websocket");
ws.onopen = load;
ws.onmessage = (message) => {
    try {
        let data = JSON.parse(message.data);
        switch (data.type) {
            case MessageType.Login:
                if (!data.data) {
                    window.location.href = "/login";
                    return;
                }
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

    data.data.servers.forEach((server) => {
        servers.innerHTML =
            `<div class="server">
            <a href="/servers/${server.id}">${server.name}</a>
            <div class="actions">
                <div class="token" onclick="token(${server.id})">
                    <key-icon />
                </div>

                <circle-icon class="status" data-id="${server.id}" />
            </div>
        </div>` + servers.innerHTML;
    });
}
