document.addEventListener('DOMContentLoaded', function() {
    const formCadastro = document.getElementById('form-cadastro');
    const btnCadastrar = document.getElementById('btn-cadastrar');
    const mensagemErro = document.getElementById('mensagem-erro');
    const mensagemSucesso = document.getElementById('mensagem-sucesso');

    formCadastro.addEventListener('submit', function(e) {
        e.preventDefault();
        btnCadastrar.disabled = true;
        mensagemErro.textContent = '';
        mensagemSucesso.textContent = '';

        // Coleta os dados do formulário
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;

        // Validação básica
        if (!nome || !email || !senha) {
            mensagemErro.textContent = 'Preencha todos os campos!';
            btnCadastrar.disabled = false;
            return;
        }

        // Verifica se já existe usuário com o mesmo email
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        if (usuarios.some(u => u.email === email)) {
            mensagemErro.textContent = 'Já existe um usuário com esse e-mail.';
            btnCadastrar.disabled = false;
            return;
        }

        // Salva o usuário no localStorage
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