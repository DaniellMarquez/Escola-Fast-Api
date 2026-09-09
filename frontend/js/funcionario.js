const formulario = document.getElementById("form-funcionario");
const mensagem = document.getElementById("mensagem");

if(formulario) {
formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    mensagem.textContent = "";

    const funcionario = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        email: document.getElementById("email").value,
        data_nascimento: document.getElementById("data_nascimento").value,
        telefone: document.getElementById("telefone").value,
        cargo: document.getElementById("cargo").value,
        cidade: document.getElementById("cidade").value
    };

    try {

        const resposta = await fetch("/funcionario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(funcionario)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {

            mensagem.textContent = "professor cadastrado com sucesso!";

            formulario.reset();

            console.log("funcionario cadastrado:", resultado);

        } else {

            mensagem.textContent = "Erro ao cadastrar funcionario: " + obterMensagemErro(resultado);

            console.error("Erro da API:", resultado);
        }

    } catch (erro) {

        mensagem.textContent = "Não foi possível conectar ao servidor.";

        console.error("Erro de conexão:", erro);
    }
});
}

function obterMensagemErro(resultado) {

    if (!resultado.detail) {
        return "Dados inválidos.";
    }

    if (Array.isArray(resultado.detail)) {

        return resultado.detail
            .map(erro => {

                const campo = erro.loc?.[1];

                if (campo === "email") {
                    return "E-mail inválido.";
                }

                if (campo === "nome") {
                    return "Nome inválido.";
                }

                if (campo === "cpf") {
                    return "CPF inválido.";
                }

                if (campo === "data_nascimento") {
                    return "Data de nascimento inválida.";
                }
                
                if (campo === "telefone") {
                    return "Telefone inválido.";
                }

                if (campo === "cargo") {
                    return "cargo inválido.";
                }

                if (campo === "cidade") {
                    return "Cidade inválida.";
                }

                return erro.msg;
            })
            .join(" ");
    }

    return resultado.detail;
}
let funcionarios = [];

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializa o cadastro se a página contiver o formulário
    const formulario = document.getElementById("form-funcionario");
    if (formulario) {
        inicializarCadastro(formulario);
    }

    // 2. Inicializa a listagem se a página contiver a tabela
    const tabela = document.getElementById("listaFuncionarios");
    if (tabela) {
        inicializarFiltros();
        carregarFuncionarios();
    }
});

function inicializarCadastro(formulario) {
    const mensagem = document.getElementById("mensagem");

    formulario.addEventListener("submit", async function(evento) {
        evento.preventDefault();

        if (mensagem) mensagem.textContent = "";

        const funcionario = {
            nome: document.getElementById("nome")?.value,
            cpf: document.getElementById("cpf")?.value,
            email: document.getElementById("email")?.value,
            data_nascimento: document.getElementById("data_nascimento")?.value,
            telefone: document.getElementById("telefone")?.value,
            cargo: document.getElementById("cargo")?.value,
            cidade: document.getElementById("cidade")?.value
        };

        try {
            // Verifique se a rota do POST é /funcionarios ou /funcionario no seu backend
            const resposta = await fetch("/funcionarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(funcionario)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                if (mensagem) mensagem.textContent = "Funcionário cadastrado com sucesso!";
                formulario.reset();
            } else {
                if (mensagem) mensagem.textContent = "Erro ao cadastrar funcionário: " + obterMensagemErro(resultado);
            }

        } catch (erro) {
            if (mensagem) mensagem.textContent = "Não foi possível conectar ao servidor.";
        }
    });
}

function obterMensagemErro(resultado) {
    if (!resultado.detail) return "Dados inválidos.";

    if (Array.isArray(resultado.detail)) {
        return resultado.detail
            .map(erro => {
                const campo = erro.loc?.[1];

                const mensagens = {
                    email: "E-mail inválido.",
                    nome: "Nome inválido.",
                    cpf: "CPF inválido.",
                    data_nascimento: "Data de nascimento inválida.",
                    telefone: "Telefone inválido.",
                    cargo: "Cargo inválido.",
                    cidade: "Cidade inválida."
                };

                return mensagens[campo] || erro.msg;
            })
            .join(" ");
    }

    return resultado.detail;
}

async function carregarFuncionarios() {
    const tabela = document.getElementById("listaFuncionarios");
    if (!tabela) return;

    try {
        // Se a sua rota backend for no singular, altere para "/funcionario"
        const resposta = await fetch("/funcionario");

        if (!resposta.ok) {
            throw new Error(`Erro ${resposta.status}: Rota não encontrada no backend.`);
        }

        funcionarios = await resposta.json();
        exibirFuncionarios(funcionarios);

    } catch (erro) {
        console.error("Erro ao carregar funcionários:", erro);
        tabela.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-danger">
                    Erro ao carregar os funcionários (404 - Rota inexistente no servidor).
                </td>
            </tr>
        `;
    }
}

function exibirFuncionarios(listaFuncionarios) {
    const tabela = document.getElementById("listaFuncionarios");
    if (!tabela) return;

    tabela.innerHTML = "";

    if (!listaFuncionarios || listaFuncionarios.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">Nenhum funcionário encontrado.</td>
            </tr>
        `;
        return;
    }

    listaFuncionarios.forEach(funcionario => {
        const linha = document.createElement("tr");
        const codigo = funcionario.codFunc ?? funcionario.id ?? "";

        linha.innerHTML = `
            <td>${codigo}</td>
            <td>${funcionario.nome ?? ''}</td>
            <td>${funcionario.cpf ?? ''}</td>
            <td>${funcionario.email ?? ''}</td>
            <td>${funcionario.data_nascimento ?? ''}</td>
            <td>${funcionario.telefone ?? ''}</td>
            <td>${funcionario.cargo ?? ''}</td>
            <td>${funcionario.cidade ?? ''}</td>
        `;

        tabela.appendChild(linha);
    });
}

function filtrarFuncionarios() {
    const campoElemento = document.getElementById("campoFiltro");
    const textoElemento = document.getElementById("textoFiltro");

    if (!campoElemento || !textoElemento) return;

    const campo = campoElemento.value;
    const texto = textoElemento.value.toLowerCase().trim();

    const funcionariosFiltrados = funcionarios.filter(funcionario => {
        let valor = funcionario[campo];

        if (campo === "codFunc" && valor === undefined) {
            valor = funcionario.id;
        }

        if (valor === null || valor === undefined) return false;

        return String(valor).toLowerCase().includes(texto);
    });

    exibirFuncionarios(funcionariosFiltrados);
}

function inicializarFiltros() {
    const textoFiltro = document.getElementById("textoFiltro");
    const campoFiltro = document.getElementById("campoFiltro");
    const btnBuscar = document.getElementById("btnBuscar");
    const btnLimparFiltro = document.getElementById("btnLimparFiltro");

    if (textoFiltro) textoFiltro.addEventListener("input", filtrarFuncionarios);
    if (campoFiltro) campoFiltro.addEventListener("change", filtrarFuncionarios);
    if (btnBuscar) btnBuscar.addEventListener("click", filtrarFuncionarios);

    if (btnLimparFiltro) {
        btnLimparFiltro.addEventListener("click", function() {
            if (textoFiltro) textoFiltro.value = "";
            exibirFuncionarios(funcionarios);
        });
    }
}