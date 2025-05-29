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

    // Conta likes e dislikes do usuário
    const likes = usuario.likes ? Object.keys(usuario.likes).length : 0;
    const dislikes = usuario.dislikes ? Object.keys(usuario.dislikes).length : 0;
    document.getElementById("total-likes").textContent = likes;
    document.getElementById("total-dislikes").textContent = dislikes;
}

function renderizarPublicacoes() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    const publicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];
    const main = document.querySelector("main.principal");
    main.innerHTML = '<h2>Publicações</h2>';

    publicacoes.forEach(pub => {
        // Verifica se o usuário já interagiu
        const deuLike = usuario?.likes && usuario.likes[pub.id];
        const deuDislike = usuario?.dislikes && usuario.dislikes[pub.id];

        main.innerHTML += `
        <div class="publicacao" data-publicacao-id="${pub.id}">
            <img src="${pub.imagem}" alt="${pub.titulo}">
            <h3>${pub.titulo}</h3>
            <p>${pub.legenda}</p>
            <div class="interacoes">
                <img src="img/${deuLike ? 'flecha_cima_cheia.svg' : 'flecha_cima_vazia.svg'}" 
                     alt="Like" class="like" style="filter:${deuLike ? 'drop-shadow(0 0 2px #FF0000)' : ''};">
                <span class="likes">${pub.likes}</span>
                <img src="img/${deuDislike ? 'flecha_baixo_cheia.svg' : 'flecha_baixo_vazia.svg'}" 
                     alt="Dislike" class="dislike" style="filter:${deuDislike ? 'drop-shadow(0 0 2px #FF0000)' : ''};">
                <span class="dislikes">${pub.dislikes}</span>
            </div>
        </div>`;
    });
}

document.addEventListener("click", function(e) {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuario) return; // só permite se logado

    const btn = e.target;
    const pubDiv = btn.closest(".publicacao");
    if (!pubDiv) return;
    const pubId = pubDiv.getAttribute("data-publicacao-id");
    let publicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let pub = publicacoes.find(p => p.id == pubId);
    let userIdx = usuarios.findIndex(u => u.email === usuario.email);

    if (btn.classList.contains("like")) {
        if (!usuario.likes) usuario.likes = {};
        if (usuario.likes[pubId]) {
            // Remover like
            delete usuario.likes[pubId];
            pub.likes--;
        } else {
            // Adicionar like (e remover dislike se existir)
            usuario.likes[pubId] = true;
            pub.likes++;
            if (usuario.dislikes && usuario.dislikes[pubId]) {
                delete usuario.dislikes[pubId];
                pub.dislikes--;
            }
        }
    }
    if (btn.classList.contains("dislike")) {
        if (!usuario.dislikes) usuario.dislikes = {};
        if (usuario.dislikes[pubId]) {
            // Remover dislike
            delete usuario.dislikes[pubId];
            pub.dislikes--;
        } else {
            // Adicionar dislike (e remover like se existir)
            usuario.dislikes[pubId] = true;
            pub.dislikes++;
            if (usuario.likes && usuario.likes[pubId]) {
                delete usuario.likes[pubId];
                pub.likes--;
            }
        }
    }

    // Atualiza usuário logado e lista de usuários
    usuarios[userIdx] = usuario;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    localStorage.setItem("publicacoes", JSON.stringify(publicacoes));

    atualizarPerfilUsuario();
    renderizarPublicacoes();
});

chatBtn?.addEventListener('click', function () {
    if (comentarioContainer.style.display === 'block') {
        comentarioContainer.style.display = 'none';
        chatBtn.classList.remove('active');
    } else {
        comentarioContainer.style.display = 'block';
        chatBtn.classList.add('active');
    }
});