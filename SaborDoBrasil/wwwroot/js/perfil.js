document.addEventListener("DOMContentLoaded", function () {
    const nomeUsuario = document.getElementById("nome-usuario");
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuarioLogado && nomeUsuario) {
        nomeUsuario.textContent = usuarioLogado.nickname;
    }
});