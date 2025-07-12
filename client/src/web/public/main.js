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
}

load();
