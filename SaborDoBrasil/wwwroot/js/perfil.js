document.addEventListener("DOMContentLoaded", function () {
    atualizarPerfil();

    // Botão de alterar perfil (foto)
    const btnAlterar = document.getElementById("btn-alterar-perfil");
    const inputFoto = document.getElementById("input-foto");

    btnAlterar.addEventListener("click", function () {
        // Só permite alterar se estiver logado
        const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (!usuario) {
            alert("Faça login para alterar seu perfil.");
            return;
        }
        inputFoto.click();
    });

    inputFoto.addEventListener("change", function () {
        const file = inputFoto.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            // Atualiza foto na tela
            document.getElementById("logo-empresa").src = e.target.result;

            // Salva foto no usuário logado e no banco de usuários
            let usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
            usuario.foto = e.target.result;
            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

            let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const idx = usuarios.findIndex(u => u.email === usuario.email);
            if (idx !== -1) {
                usuarios[idx].foto = e.target.result;
                localStorage.setItem("usuarios", JSON.stringify(usuarios));
            }
        };
        reader.readAsDataURL(file);
    });
});

// Função para atualizar o perfil na tela
function atualizarPerfil() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    const nome = usuario ? usuario.nome : "Guest";
    const foto = usuario && usuario.foto ? usuario.foto : "img/user_default.png";
    document.getElementById("nome-empresa").textContent = nome;
    document.getElementById("logo-empresa").src = foto;

    // Contabiliza likes/dislikes do usuário logado
    let totalLikes = 0, totalDislikes = 0;
    if (usuario && usuario.likes) totalLikes = Object.keys(usuario.likes).length;
    if (usuario && usuario.dislikes) totalDislikes = Object.keys(usuario.dislikes).length;
    document.getElementById("total-likes").textContent = totalLikes;
    document.getElementById("total-dislikes").textContent = totalDislikes;
}