const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm_password");
const change = document.getElementById("change");
const returnButton = document.getElementById("return");

returnButton.addEventListener("click", () => {
    window.location.href = "/";
});

change.addEventListener("click", async () => {
    if (!password.value) return showError("Empty password");
    if (!confirmPassword.value) return showError("Empty confirm password");
    if (password.value !== confirmPassword.value)
        return showError("The two passwords don't match.");

    if (password.value.length < 3) return showError("Password too short");

    let res = await fetch(`/api/password`, {
        method: "PUT",
        body: JSON.stringify({ password: password.value }),
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
    });

    try {
        if (!res.ok) throw new Error("error");

        let data = await res.json();
        if (!data.ok) throw new Error("error");

        showSuccess(
            "The password has been successfully changed. Redirection to main page in 3 seconds...",
        );

        setTimeout(() => {
            window.location.href = "/";
        }, 3 * 1000);
    } catch {
        return showError("An error occurred while changing the password.");
    }
});
