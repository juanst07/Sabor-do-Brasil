document.addEventListener("DOMContentLoaded", function () {
    const btnCurtir = document.getElementById("btn-curtir");
    const btnDescurtir = document.getElementById("btn-descurtir");
    const contadorCurtidas = document.getElementById("contador-curtidas");
    const contadorDeslikes = document.getElementById("contador-deslikes");
    const btnComentar = document.getElementById("btn-comentar");
    const listaComentarios = document.getElementById("lista-comentarios");
    const inputComentario = document.getElementById("input-comentario");

    let curtidas = parseInt(localStorage.getItem("curtidas") || "0");
    let deslikes = parseInt(localStorage.getItem("deslikes") || "0");
    let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];

    contadorCurtidas.textContent = curtidas;
    contadorDeslikes.textContent = deslikes;
    atualizarComentarios();

    btnCurtir?.addEventListener("click", () => {
        curtidas++;
        localStorage.setItem("curtidas", curtidas);
        contadorCurtidas.textContent = curtidas;
    });

    btnDescurtir?.addEventListener("click", () => {
        deslikes++;
        localStorage.setItem("deslikes", deslikes);
        contadorDeslikes.textContent = deslikes;
    });

    btnComentar?.addEventListener("click", () => {
        const texto = inputComentario.value.trim();
        if (texto) {
            comentarios.push(texto);
            localStorage.setItem("comentarios", JSON.stringify(comentarios));
            atualizarComentarios();
            inputComentario.value = "";
        }
    });

    function atualizarComentarios() {
        listaComentarios.innerHTML = "";
        comentarios.forEach(comentario => {
            const li = document.createElement("li");
            li.textContent = comentario;
            listaComentarios.appendChild(li);
        });
    }

    // Abrir comentário ao clicar no chat ou imagem
    document.querySelectorAll('.publicacao').forEach(pub => {
        const chat = pub.querySelector('.comentarios');
        const img = pub.querySelector('img');
        const comentarioContainer = pub.querySelector('.comentario-container');
        const textarea = pub.querySelector('.comentario-texto');
        const btnComentar = pub.querySelector('.btn-comentar');
        const comentariosLista = pub.querySelector('.comentarios-lista');
        const pubId = pub.getAttribute('data-publicacao-id');
        
        // Mostra o campo de comentário ao clicar no chat ou imagem
        [chat, img].forEach(el => {
            el.onclick = function () {
                if (!usuarioEstaLogado()) {
                    abrirModalLogin();
                    return;
                }
                document.querySelectorAll('.comentario-container').forEach(c => c.style.display = 'none');
                comentarioContainer.style.display = 'block';
                // Preenche nome do usuário
                const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
                pub.querySelector('.comentario-nome').textContent = usuario.nome;
                textarea.value = "";
                btnComentar.disabled = true;
                renderizarComentarios(pubId, comentariosLista);
            };
        });

        // Habilita botão comentar só se textarea tiver texto
        textarea?.addEventListener('input', function () {
            btnComentar.disabled = !textarea.value.trim();
        });

        // Ao comentar
        btnComentar?.addEventListener('click', function () {
            const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
            if (!usuario) return;
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
            btnComentar.disabled = true;
            renderizarComentarios(pubId, comentariosLista);
        });
    });
});

// Renderiza comentários da publicação
function renderizarComentarios(pubId, container) {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    const publicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];
    const pub = publicacoes.find(p => p.id == pubId);
    container.innerHTML = "";
    if (!pub?.comentarios) return;
    pub.comentarios.forEach(com => {
        const isUser = usuario && com.email === usuario.email;
        container.innerHTML += `
        <div class="comentario-item" data-comentario-id="${com.id}">
            <div class="comentario-topo">
                <span class="comentario-nome">${com.usuario}</span>
                ${isUser ? `
                    <img src="img/lapis_editar.svg" class="editar-comentario" title="Editar" style="width:18px;cursor:pointer;margin-left:8px;filter:brightness(10);" />
                    <img src="img/lixeira_deletar.svg" class="deletar-comentario" title="Excluir" style="width:18px;cursor:pointer;margin-left:4px;filter:drop-shadow(0 0 2px #FF0000);" />
                ` : ""}
            </div>
            <div class="comentario-texto-visual">${com.texto}</div>
        </div>
        `;
    });
    // Adicione eventos de editar/excluir aqui (veja abaixo)
    // Editar comentário
    container.querySelectorAll('.editar-comentario').forEach(btn => {
        btn.onclick = function () {
            const item = btn.closest('.comentario-item');
            const comentarioId = item.getAttribute('data-comentario-id');
            const textoDiv = item.querySelector('.comentario-texto-visual');
            textoDiv.contentEditable = true;
            textoDiv.focus();
            // Adiciona botão atualizar
            let btnAtualizar = document.createElement('button');
            btnAtualizar.textContent = "Atualizar";
            btnAtualizar.style.cssText = "background:#D97014;color:#fff;border:none;border-radius:5px;padding:4px 12px;float:right;margin-top:6px;";
            textoDiv.after(btnAtualizar);
            btnAtualizar.onclick = function () {
                let publicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];
                let pub = publicacoes.find(p => p.id == pubId);
                let com = pub.comentarios.find(c => c.id == comentarioId);
                com.texto = textoDiv.textContent;
                localStorage.setItem("publicacoes", JSON.stringify(publicacoes));
                renderizarComentarios(pubId, container);
            };
        };
    });

    // Excluir comentário
    container.querySelectorAll('.deletar-comentario').forEach(btn => {
        btn.onclick = function () {
            const item = btn.closest('.comentario-item');
            const comentarioId = item.getAttribute('data-comentario-id');
            // Exibe modal de confirmação
            if (confirm("Deseja realmente excluir este comentário?")) {
                let publicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];
                let pub = publicacoes.find(p => p.id == pubId);
                pub.comentarios = pub.comentarios.filter(c => c.id != comentarioId);
                localStorage.setItem("publicacoes", JSON.stringify(publicacoes));
                renderizarComentarios(pubId, container);
            }
        };
    });
}

