document.addEventListener("DOMContentLoaded", function () {
    // Inicializa publicações no localStorage se não existir
    if (!localStorage.getItem("publicacoes")) {
        const publicacoes = [
            { id: "1", titulo: "Camarão Frito", likes: 0, dislikes: 0, comentarios: [] },
            { id: "2", titulo: "Bolo de Carne", likes: 0, dislikes: 0, comentarios: [] },
            { id: "3", titulo: "Bife com Legumes", likes: 0, dislikes: 0, comentarios: [] }
        ];
        localStorage.setItem("publicacoes", JSON.stringify(publicacoes));
    }

    atualizarLikesDislikesNaTela();
    atualizarTotaisPerfil();

    document.querySelectorAll('.publicacao').forEach(pub => {
        const pubId = pub.getAttribute('data-publicacao-id');
        const btnLike = pub.querySelector('.like');
        const btnDislike = pub.querySelector('.dislike');
        const chatBtn = pub.querySelector('.comentarios');
        const numComentariosSpan = pub.querySelector('.num-comentarios');
        const comentarioContainer = pub.querySelector('.comentario-container');
        const textarea = pub.querySelector('.comentario-texto');
        const btnComentar = pub.querySelector('.btn-comentar');
        const comentariosLista = pub.querySelector('.comentarios-lista');

        // Só adiciona eventos se todos os elementos existirem
        if (!btnLike || !btnDislike || !chatBtn || !numComentariosSpan || !comentarioContainer || !textarea || !btnComentar || !comentariosLista) {
            return;
        }

        // Like
        btnLike?.addEventListener('click', function () {
            if (!usuarioEstaLogado()) {
                abrirModalLogin();
                return;
            }
            interagirPublicacao(pubId, "like");
            atualizarTotaisPerfil();
        });

        // Dislike
        btnDislike?.addEventListener('click', function () {
            if (!usuarioEstaLogado()) {
                abrirModalLogin();
                return;
            }
            interagirPublicacao(pubId, "dislike");
            atualizarTotaisPerfil();
        });

        // Abrir comentário ao clicar no chat
        chatBtn?.addEventListener('click', function () {
            if (comentarioContainer.style.display === 'block') {
                comentarioContainer.style.display = 'none';
                chatBtn.classList.remove('active');
            } else {
                comentarioContainer.style.display = 'block';
                chatBtn.classList.add('active');
            }
        });

        // Habilita botão comentar só se textarea tiver texto
        textarea?.addEventListener('input', function () {
            btnComentar.disabled = !textarea.value.trim();
        });

        // Ao comentar
        btnComentar?.addEventListener('click', function () {
            const usuario = JSON.parse(localStorage.getItem("usuarioLogado")) || { nome: "Anônimo", email: "" };
            const texto = textarea.value.trim();
            if (!texto) return;
            let publicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];
            let pubObj = publicacoes.find(p => p.id == pubId);
            if (!pubObj.comentarios) pubObj.comentarios = [];
            const novoComentario = {
                id: "c" + Date.now(),
                usuario: usuario.nome,
                email: usuario.email,
                texto,
                data: new Date().toISOString()
            };
            pubObj.comentarios.push(novoComentario);
            localStorage.setItem("publicacoes", JSON.stringify(publicacoes));
            textarea.value = "";
            btnComentar.disabled = !textarea.value.trim(); // <-- Troque aqui!
            renderizarComentarios(pubId, comentariosLista);
            numComentariosSpan.textContent = pubObj.comentarios.length;
        });

        // Atualiza comentários ao carregar
        let publicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];
        let pubObj = publicacoes.find(p => p.id == pubId);
        if (pubObj && pubObj.comentarios) {
            numComentariosSpan.textContent = pubObj.comentarios.length;
            renderizarComentarios(pubId, comentariosLista);
        }
    });

    // Bloqueia qualquer clique nas imagens das publicações
    document.querySelectorAll('.publicacao img').forEach(img => {
        img.onclick = function(e) {
            e.preventDefault();
            return false;
        };
    });
});

// Atualiza os totais no perfil do usuário
function atualizarTotaisPerfil() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    let totalLikes = 0, totalDislikes = 0;
    if (usuario && usuario.likes) totalLikes = Object.keys(usuario.likes).length;
    if (usuario && usuario.dislikes) totalDislikes = Object.keys(usuario.dislikes).length;
    document.getElementById('total-likes').textContent = totalLikes;
    document.getElementById('total-dislikes').textContent = totalDislikes;
}

// Função para verificar se está logado
function usuarioEstaLogado() {
    return !!localStorage.getItem("usuarioLogado");
}

// Caso não tenha modal de login, pode comentar a linha abaixo
function abrirModalLogin() {
    const modal = document.getElementById("modal-login");
    if (modal) modal.style.display = "block";
}

// Função principal de interação de like/dislike
function interagirPublicacao(pubId, tipo) {
    let usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let publicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];
    let pub = publicacoes.find(p => p.id === pubId);
    let userIdx = usuarios.findIndex(u => u.email === usuario.email);

    if (!usuario.likes) usuario.likes = {};
    if (!usuario.dislikes) usuario.dislikes = {};

    // LIKE
    if (tipo === "like") {
        if (usuario.likes[pubId]) {
            // Remover like
            delete usuario.likes[pubId];
            pub.likes = Math.max(0, pub.likes - 1);
        } else {
            // Adicionar like
            usuario.likes[pubId] = true;
            pub.likes += 1;
            // Se tinha dislike, remove
            if (usuario.dislikes[pubId]) {
                delete usuario.dislikes[pubId];
                pub.dislikes = Math.max(0, pub.dislikes - 1);
            }
        }
        // Garante que só pode ter like OU dislike
        delete usuario.dislikes[pubId];
    }

    // DISLIKE
    if (tipo === "dislike") {
        if (usuario.dislikes[pubId]) {
            // Remover dislike
            delete usuario.dislikes[pubId];
            pub.dislikes = Math.max(0, pub.dislikes - 1);
        } else {
            // Adicionar dislike
            usuario.dislikes[pubId] = true;
            pub.dislikes += 1;
            // Se tinha like, remove
            if (usuario.likes[pubId]) {
                delete usuario.likes[pubId];
                pub.likes = Math.max(0, pub.likes - 1);
            }
        }
        // Garante que só pode ter like OU dislike
        delete usuario.likes[pubId];
    }

    // Atualiza usuário logado e lista de usuários
    usuarios[userIdx] = usuario;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    localStorage.setItem("publicacoes", JSON.stringify(publicacoes));

    atualizarLikesDislikesNaTela();
    if (typeof atualizarPerfil === "function") atualizarPerfil();
}

// Atualiza os likes/dislikes na tela e ícones
function atualizarLikesDislikesNaTela() {
    let usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    let publicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];

    document.querySelectorAll('.publicacao').forEach(pub => {
        const pubId = pub.getAttribute('data-publicacao-id');
        const btnLike = pub.querySelector('.like');
        const btnDislike = pub.querySelector('.dislike');
        const spanLikes = pub.querySelector('.likes');
        const spanDislikes = pub.querySelector('.dislikes');

        // Atualiza contadores
        let pubObj = publicacoes.find(p => p.id === pubId);
        spanLikes.textContent = pubObj ? pubObj.likes : 0;
        spanDislikes.textContent = pubObj ? pubObj.dislikes : 0;

        // Atualiza ícones e cor
        if (usuario && usuario.likes && usuario.likes[pubId]) {
            btnLike.classList.add('active');
            btnDislike.classList.remove('active');
        } else if (usuario && usuario.dislikes && usuario.dislikes[pubId]) {
            btnLike.classList.remove('active');
            btnDislike.classList.add('active');
        } else {
            btnLike.classList.remove('active');
            btnDislike.classList.remove('active');
        }
    });
}

// Renderiza comentários da publicação
function renderizarComentarios(pubId, container) {
    const publicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];
    const pub = publicacoes.find(p => p.id == pubId);
    container.innerHTML = "";
    if (!pub?.comentarios) return;
    pub.comentarios.forEach(com => {
        container.innerHTML += `
            <div class="comentario-item">
                <span class="comentario-nome"><b>${com.usuario}</b></span>
                <span style="font-size:0.85em; color:#555; float:right;">${tempoRelativo(com.data)}</span><br>
                <span class="comentario-texto-visual">${com.texto}</span>
            </div>
        `;
    });
}

function tempoRelativo(data) {
    const agora = new Date();
    const diff = Math.floor((agora - new Date(data)) / 1000); // diferença em segundos

    if (diff < 60) return `há ${diff} segundo${diff === 1 ? '' : 's'}`;
    const min = Math.floor(diff / 60);
    if (min < 60) return `há ${min} minuto${min === 1 ? '' : 's'}`;
    const horas = Math.floor(min / 60);
    if (horas < 24) return `há ${horas} hora${horas === 1 ? '' : 's'}`;
    const dias = Math.floor(horas / 24);
    if (dias < 7) return `há ${dias} dia${dias === 1 ? '' : 's'}`;
    const semanas = Math.floor(dias / 7);
    if (semanas < 4) return `há ${semanas} semana${semanas === 1 ? '' : 's'}`;
    const meses = Math.floor(dias / 30);
    if (meses < 12) return `há ${meses} mês${meses === 1 ? '' : 'es'}`;
    const anos = Math.floor(dias / 365);
    return `há ${anos} ano${anos === 1 ? '' : 's'}`;
}