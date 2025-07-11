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
                        .querySelector(`svg[data-id="${id}"]`)
                        .classList.add("online");
                } else {
                    document
                        .querySelector(`svg[data-id="${id}"]`)
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
    if (token === undefined) {
        window.location.href = "/login";
        return;
    }

    let res = await fetch(`/api/auth/validity`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    try {
        let data = await res.json();
        if (!data.ok) {
            throw new Error(data.code);
        }
    } catch (e) {
        window.location.href = "/login";
        return;
    }

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
            <a href="/server/${server.id}">${server.name}</a>
            <div class="actions">
                <div class="token" onclick="token(${server.id})">
                    <svg
                        viewBox="0 0 888 888"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M0 751H205V888H0V751Z" fill="white" />
                        <path d="M69 683H342V751H69V683Z" fill="white" />
                        <path d="M137 615H410V683H137V615Z" fill="white" />
                        <path d="M205 547H478V615H205V547Z" fill="white" />
                        <path d="M273 479H751V547H273V479Z" fill="white" />
                        <path d="M341 411H819V479H341V411Z" fill="white" />
                        <path d="M342 205H888V411H342V205Z" fill="white" />
                        <path d="M342 137H615V205H342V137Z" fill="white" />
                        <path d="M410 69H819V137H410V69Z" fill="white" />
                        <path d="M751 137H888V205H751V137Z" fill="white" />
                        <path d="M478 0H751V69H478V0Z" fill="white" />
                        <path d="M273 751H205V819H273V751Z" fill="white" />
                    </svg>
                </div>

                <svg
                    viewBox="0 0 470 474"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="status"
                    data-id="${server.id}"
                >
                    <path d="M90 108H379V474H90V108Z" />
                    <path d="M0 380V93H108V380H0Z" />
                    <path d="M362 380V93H470V380H362Z" />
                    <path d="M379 108H92V0L379 0V108Z" />
                </svg>
            </div>
        </div>` + servers.innerHTML;
    });
}
