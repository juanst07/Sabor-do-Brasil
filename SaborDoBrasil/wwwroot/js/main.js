document.addEventListener("DOMContentLoaded", function () {
    const perfilContainer = document.getElementById("perfil-container");

    let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (usuarioLogado) {
        perfilContainer.style.display = "block";
        document.querySelector(".login").style.display = "none";
    }
});

// No carregamento da página:
if (localStorage.getItem("usuarioLogado")) {
    document.getElementById("btn-login").textContent = "Sair";
    document.getElementById("btn-login").onclick = function() {
        localStorage.removeItem("usuarioLogado");
        location.reload();
    }
}

// Exemplo para ser colocado em main.js ou logo após o login
function atualizarPerfilUsuario() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuario) return;

    // Atualiza nome e imagem
    document.getElementById("nome-empresa").textContent = usuario.nome;
    if (usuario.foto) {
        document.getElementById("logo-empresa").src = usuario.foto;
    } else {
        document.getElementById("logo-empresa").src = "img/user_default.png";
    }
}