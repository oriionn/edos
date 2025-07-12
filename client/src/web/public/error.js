const errorSpan = document.getElementById("error");

function showError(text) {
    errorSpan.classList.remove("success");
    errorSpan.innerHTML = "⚠️ " + text;
}

function showSuccess(text) {
    errorSpan.classList.add("success");
    errorSpan.innerHTML = "✅ " + text;
}

function hideError() {
    errorSpan.innerHTML = "";
}
