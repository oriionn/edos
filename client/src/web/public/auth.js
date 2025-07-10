const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login");
const errorSpan = document.getElementById("error");

function showError(text) {
    errorSpan.innerHTML = "⚠️ " + text;
}

function hideError() {
    errorSpan.innerHTML = "";
}

loginButton.addEventListener("click", async () => {
    if (passwordInput.value.length === 0) {
        return showError("Empty password");
    }

    let res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: passwordInput.value }),
    });

    if (res.status !== 200) {
        try {
            let data = await res.json();
            switch (data.code) {
                case "INVALID_PASSWORD":
                    showError(`Your password is invalid.`);
                    break;
                default:
                    throw new Error("default");
                    break;
            }
        } catch (e) {
            showError(`An error occurred during authentication`);
        }
        return;
    } else {
        let data = await res.json();
        hideError();

        localStorage.setItem("token", data.data);
        window.location.href = "/";
    }
});
