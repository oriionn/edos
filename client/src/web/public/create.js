const returnButton = document.getElementById("return");
const nameInput = document.getElementById("name");
const createButton = document.getElementById("create");

returnButton.addEventListener("click", () => {
    window.location.href = "/";
});

createButton.addEventListener("click", async () => {
    if (!nameInput.value || nameInput.value.length === 0)
        return showError(`Name input is empty`);
    else hideError();

    let res = await fetch(`/api/servers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
            name: nameInput.value,
        }),
    });

    if (!res.ok)
        return showError(`An error occurred when creating your server`);

    try {
        let data = await res.json();
        if (!data.ok) throw new Error("not ok");

        window.location.href = "/";
    } catch (e) {
        return showError(`An error occurred when creating your server`);
    }
});
