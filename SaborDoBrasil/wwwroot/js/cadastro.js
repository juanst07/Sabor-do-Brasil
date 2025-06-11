document.addEventListener('DOMContentLoaded', function () {
    const formCadastro = document.getElementById('form-cadastro');
    const btnCadastrar = document.getElementById('btn-cadastrar');
    const mensagemErro = document.getElementById('mensagem-erro');
    const mensagemSucesso = document.getElementById('mensagem-sucesso');

    formCadastro.addEventListener('submit', function (e) {
        e.preventDefault();
        btnCadastrar.disabled = true;
        mensagemErro.textContent = '';
        mensagemSucesso.textContent = '';

        // Coleta os dados do formulário
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();

        // Validação simples
        if (!nome || !email || !senha) {
            mensagemErro.textContent = 'Preencha todos os campos!';
            btnCadastrar.disabled = false;
            return;
        }

        // Recupera usuários já cadastrados
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        // Verifica se o e-mail já está cadastrado
        const usuarioExistente = usuarios.find(u => u.email === email);
        if (usuarioExistente) {
            mensagemErro.textContent = 'E-mail já cadastrado!';
            btnCadastrar.disabled = false;
            return;
        }

        // Adiciona novo usuário
        usuarios.push({ nome, email, senha });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        mensagemSucesso.textContent = 'Cadastro realizado com sucesso! Você já pode fazer login.';
        formCadastro.reset();

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

        btnCadastrar.disabled = false;
    });
});