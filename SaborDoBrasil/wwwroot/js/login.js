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
        document.getElementById('ssenha').classList.remove('erro');
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
        const senha = document.getElementById("ssenha");
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
        // Agora compara pelo e-mail
        const usuario = usuarios.find(u => u.email === nickname.value && u.senha === senha.value);

        if (usuario) {
            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
            location.reload();
        } else {
            mensagemErro.textContent = "E-mail ou senha incorretos.";
            nickname.classList.add('erro');
            senha.classList.add('erro');
        }
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
});