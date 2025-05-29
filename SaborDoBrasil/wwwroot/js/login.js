document.addEventListener("DOMContentLoaded", function () {
    const modalLogin = document.getElementById("modal-login");
    const btnCancelar = document.getElementById("btn-cancelar");
    const btnEntrar = document.getElementById("btn-entrar");
    const btnIrCadastro = document.getElementById("btn-ir-cadastro");
    const btnLogin = document.getElementById("btn-login");
    const mensagemErro = document.getElementById("mensagem-erro");

    function abrirModalLogin() {
        document.getElementById('modal-login').classList.add('active');
        document.getElementById('mensagem-erro').textContent = '';
        document.getElementById('nickname').classList.remove('erro');
        document.getElementById('senha').classList.remove('erro');
    }

    function fecharModalLogin() {
        document.getElementById('modal-login').classList.remove('active');
    }

    btnLogin?.addEventListener("click", abrirModalLogin);

    btnCancelar?.addEventListener("click", () => {
        fecharModalLogin();
        mensagemErro.textContent = "";
    });

    btnIrCadastro?.addEventListener("click", () => {
        window.location.href = "cadastro.html";
    });

    btnEntrar?.addEventListener("click", () => {
        const nickname = document.getElementById("nickname"); // Este campo agora será o e-mail
        const senha = document.getElementById("senha"); // Corrigido aqui!
        let erro = false;

        nickname.classList.remove('erro');
        senha.classList.remove('erro');
        mensagemErro.textContent = '';

        if (!nickname.value) {
            nickname.classList.add('erro');
            erro = true;
        }
        if (!senha.value) {
            senha.classList.add('erro');
            erro = true;
        }
        if (erro) return;

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const usuario = usuarios.find(u => u.email === nickname.value);

        if (!usuario) {
            mensagemErro.textContent = "E-mail não cadastrado. Cadastre-se!";
            nickname.classList.add('erro');
            return;
        }

        if (usuario.senha !== senha.value) {
            mensagemErro.textContent = "Senha incorreta.";
            senha.classList.add('erro');
            return;
        }

        // Login bem-sucedido
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        atualizarPerfil();
        location.reload();
    });

    // Exemplo: abrir modal ao tentar interagir sem login
    document.querySelectorAll('.like, .dislike, .comentarios').forEach(btn => {
        btn.onclick = function(e) {
            if (!usuarioEstaLogado()) { // Implemente essa função conforme seu sistema
                abrirModalLogin();
                e.preventDefault();
            }
        }
    });

    // Adicione este trecho:
    const abrirCadastro = document.getElementById("abrir-cadastro");
    if (abrirCadastro) {
        abrirCadastro.addEventListener("click", function(e) {
            e.preventDefault();
            window.location.href = "cadastro.html";
        });
    }

    document.getElementById("btn-login").addEventListener("click", function() {
        if (localStorage.getItem("usuarioLogado")) {
            localStorage.removeItem("usuarioLogado");
            atualizarPerfil();
            location.reload();
        }
    });
});