const errorSpan = document.getElementById("error");

function showError(text) {
    errorSpan.innerHTML = "⚠️ " + text;
}

function hideError() {
    errorSpan.innerHTML = "";
}
