// ================= PARÂMETRO DA URL =================
// cadastrodeprofessor.html            -> cadastro (POST)
// cadastrodeprofessor.html?codProf=5  -> alteração (PUT)

const parametros = new URLSearchParams(window.location.search);
const codProf = parametros.get("codProf");


// ================= CADASTRO / ALTERAÇÃO =================

const formulario = document.getElementById("form-professor");
const mensagem = document.getElementById("mensagem");

if (formulario) {
    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        mensagem.textContent = "";

        const professor = {
            nome: document.getElementById("nome").value,
            cpf: document.getElementById("cpf").value,
            email: document.getElementById("email").value,
            data_nascimento: document.getElementById("data_nascimento").value,
            telefone: document.getElementById("telefone").value,
            cidade: document.getElementById("cidade").value
        };

        try {
            let resposta;

            if (codProf) {
                resposta = await fetch(`/professor/${codProf}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(professor)
                });
            } else {
                resposta = await fetch("/professor", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(professor)
                });
            }

            const resultado = await resposta.json();

            if (resposta.ok) {
                if (codProf) {
                    mensagem.textContent = "Professor alterado com sucesso!";
                } else {
                    mensagem.textContent = "Professor cadastrado com sucesso!";
                    formulario.reset();
                }
            } else {
                mensagem.textContent = "Erro: " + obterMensagemErro(resultado);
                console.error("Erro da API:", resultado);
            }

        } catch (erro) {
            mensagem.textContent = "Não foi possível conectar ao servidor.";
            console.error("Erro de conexão:", erro);
        }
    });
}


async function carregarProfessorParaAlteracao() {

    if (!codProf || !formulario) {
        return;
    }

    try {
        const resposta = await fetch("/professor");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar professores.");
        }

        const lista = await resposta.json();

        const professor = lista.find(
            item => item.codProf == codProf
        );

        if (!professor) {
            mensagem.textContent = "Professor não encontrado.";
            return;
        }

        document.getElementById("nome").value = professor.nome;
        document.getElementById("cpf").value = professor.cpf;
        document.getElementById("email").value = professor.email;
        document.getElementById("data_nascimento").value = professor.data_nascimento;
        document.getElementById("telefone").value = professor.telefone;
        document.getElementById("cidade").value = professor.cidade;

        document.getElementById("tituloFormulario").textContent =
            "Alterar Professor";

        document.getElementById("btnSalvar").textContent =
            "Salvar alterações";

    } catch (erro) {
        console.error("Erro ao carregar professor:", erro);

        mensagem.textContent =
            "Não foi possível carregar os dados do professor.";
    }
}


// ================= MENSAGENS DE ERRO =================

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

                if (campo === "cidade") {
                    return "Cidade inválida.";
                }

                return erro.msg;
            })
            .join(" ");
    }

    return resultado.detail;
}


// ================= LISTAGEM =================

let professores = [];

function escaparHtml(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[caractere]));
}

function alterarProfessor(codigo) {

    window.location.href =
        `/cadastro-de-professor?codProf=${codigo}`;

}

async function excluirProfessor(codigo) {

    if (!confirm("Deseja realmente excluir este professor?")) {
        return;
    }

    try {

        const resposta = await fetch(`/professor/${codigo}`, {
            method: "DELETE"
        });

        const resultado = await resposta.json();

        if (resposta.ok) {

            await carregarProfessores();

            if (textoFiltro && textoFiltro.value.trim()) {
                filtrarProfessores();
            }

        } else {

            alert("Erro ao excluir: " + obterMensagemErro(resultado));
            console.error("Erro da API:", resultado);

        }

    } catch (erro) {

        alert("Não foi possível conectar ao servidor.");
        console.error("Erro de conexão:", erro);

    }
}

function exibirProfessores(listaProfessores) {

    const tabela = document.getElementById("listaProfessores");

    if (!tabela) {
        return;
    }

    tabela.innerHTML = "";

    listaProfessores.forEach(professor => {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${escaparHtml(professor.codProf)}</td>
            <td>${escaparHtml(professor.nome)}</td>
            <td>${escaparHtml(professor.cpf)}</td>
            <td>${escaparHtml(professor.email)}</td>
            <td>${escaparHtml(professor.data_nascimento)}</td>
            <td>${escaparHtml(professor.telefone)}</td>
            <td>${escaparHtml(professor.cidade)}</td>
            <td>
                <button
                    type="button"
                    class="btn btn-warning btn-sm"
                    onclick="alterarProfessor(${Number(professor.codProf)})"
                >
                    ✏️ Alterar
                </button>
                <button
                    type="button"
                    class="btn btn-danger btn-sm ms-1"
                    onclick="excluirProfessor(${Number(professor.codProf)})"
                >
                    🗑️ Excluir
                </button>
            </td>
        `;

        tabela.appendChild(linha);

    });
}


async function carregarProfessores() {

    const tabela = document.getElementById("listaProfessores");

    if (!tabela) {
        return;
    }

    try {

        const resposta = await fetch("/professor");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar professores.");
        }

        professores = await resposta.json();

        exibirProfessores(professores);

    } catch (erro) {

        console.error("Erro ao carregar professores:", erro);

        tabela.innerHTML = `
            <tr>
                <td colspan="8">
                    Erro ao carregar os professores.
                </td>
            </tr>
        `;
    }
}


// ================= FILTRO =================

function filtrarProfessores() {

    const campoElemento = document.getElementById("campoFiltro");
    const textoElemento = document.getElementById("textoFiltro");

    if (!campoElemento || !textoElemento) {
        return;
    }

    const campo = campoElemento.value;

    const texto = textoElemento.value
        .toLowerCase()
        .trim();

    const professoresFiltrados = professores.filter(professor => {

        const valor = professor[campo];

        if (valor === null || valor === undefined) {
            return false;
        }

        return String(valor)
            .toLowerCase()
            .includes(texto);

    });

    exibirProfessores(professoresFiltrados);
}


const textoFiltro = document.getElementById("textoFiltro");

if (textoFiltro) {
    textoFiltro.addEventListener("input", filtrarProfessores);
}


const campoFiltro = document.getElementById("campoFiltro");

if (campoFiltro) {
    campoFiltro.addEventListener("change", filtrarProfessores);
}


const btnLimparFiltro = document.getElementById("btnLimparFiltro");

if (btnLimparFiltro) {

    btnLimparFiltro.addEventListener("click", function () {

        document.getElementById("textoFiltro").value = "";

        exibirProfessores(professores);

    });

}


// ================= INICIALIZAÇÃO =================

carregarProfessores();
carregarProfessorParaAlteracao();