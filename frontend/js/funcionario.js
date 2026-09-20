const parametros = new URLSearchParams(window.location.search);
const codFunc = parametros.get("codFunc");

const formulario = document.getElementById("form-funcionario");
const mensagem = document.getElementById("mensagem");

if (formulario) {
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

        const url = codFunc ? `/funcionario/${codFunc}` : "/funcionario";
        const metodo = codFunc ? "PUT" : "POST";

        try {
            const resposta = await fetch(url, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(funcionario)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                if (codFunc) {
                    if (mensagem) mensagem.textContent = "Funcionário alterado com sucesso!";
                    console.log("Funcionário alterado:", resultado);
                } else {
                    if (mensagem) mensagem.textContent = "Funcionário cadastrado com sucesso!";
                    formulario.reset();
                    console.log("Funcionário cadastrado:", resultado);
                }
            } else {
                const acao = codFunc ? "alterar" : "cadastrar";
                if (mensagem) mensagem.textContent = `Erro ao ${acao} funcionario: ` + obterMensagemErro(resultado);
                console.error("Erro da API:", resultado);
            }

        } catch (erro) {
            if (mensagem) mensagem.textContent = "Não foi possível conectar ao servidor.";
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
                    return "Cargo inválido.";
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

async function carregarFuncionarios() {

    const tabela = document.getElementById("listaFuncionarios");

    if (!tabela) {
        return;
    }

    try {

        const resposta = await fetch("/funcionario");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar funcionarios.");
        }

        funcionarios = await resposta.json();

        exibirFuncionarios(funcionarios);

    } catch (erro) {

        console.error("Erro ao carregar funcionarios:", erro);

        tabela.innerHTML = `
            <tr>
                <td colspan="9">
                    Erro ao carregar os funcionários.
                </td>
            </tr>
        `;
    }
}


function exibirFuncionarios(listaFuncionarios) {

    const tabela = document.getElementById("listaFuncionarios");

    if (!tabela) {
        return;
    }

    tabela.innerHTML = "";

    listaFuncionarios.forEach(funcionario => {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${funcionario.codFunc}</td>
            <td>${funcionario.nome}</td>
            <td>${funcionario.cpf}</td>
            <td>${funcionario.email}</td>
            <td>${funcionario.data_nascimento}</td>
            <td>${funcionario.telefone}</td>
            <td>${funcionario.cargo}</td>
            <td>${funcionario.cidade}</td>
            <td>
                <button
                    type="button"
                    class="btn btn-warning btn-sm"
                    onclick="alterarFuncionario(${funcionario.codFunc})"
                >
                    ✏️ Alterar
                </button>
                <button
                    type="button"
                    class="btn btn-danger btn-sm ms-1"
                    onclick="excluirFuncionario(${funcionario.codFunc})"
                >
                    🗑️ Excluir
                </button>
            </td>
        `;

        tabela.appendChild(linha);

    });
}


function alterarFuncionario(codFunc) {
    window.location.href = `/cadastro-de-funcionario?codFunc=${codFunc}`;
}


async function excluirFuncionario(codFunc) {

    if (!confirm("Deseja realmente excluir este funcionário?")) {
        return;
    }

    try {

        const resposta = await fetch(`/funcionario/${codFunc}`, {
            method: "DELETE"
        });

        const resultado = await resposta.json();

        if (resposta.ok) {

            await carregarFuncionarios();

            if (textoFiltro && textoFiltro.value.trim()) {
                filtrarFuncionarios();
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


function filtrarFuncionarios() {

    const campoElemento =
        document.getElementById("campoFiltro");

    const textoElemento =
        document.getElementById("textoFiltro");

    if (!campoElemento || !textoElemento) {
        return;
    }

    const campo = campoElemento.value;

    const texto = textoElemento.value
        .toLowerCase()
        .trim();

    const funcionariosFiltrados = funcionarios.filter(funcionario => {

        const valor = funcionario[campo];

        if (valor === null || valor === undefined) {
            return false;
        }

        return String(valor)
            .toLowerCase()
            .includes(texto);

    });

    exibirFuncionarios(funcionariosFiltrados);
}


const textoFiltro =
    document.getElementById("textoFiltro");

if (textoFiltro) {

    textoFiltro.addEventListener(
        "input",
        filtrarFuncionarios
    );

}


const campoFiltro =
    document.getElementById("campoFiltro");

if (campoFiltro) {

    campoFiltro.addEventListener(
        "change",
        filtrarFuncionarios
    );

}


const btnBuscar =
    document.getElementById("btnBuscar");

if (btnBuscar) {

    btnBuscar.addEventListener(
        "click",
        filtrarFuncionarios
    );

}


const btnLimparFiltro =
    document.getElementById("btnLimparFiltro");

if (btnLimparFiltro) {

    btnLimparFiltro.addEventListener(
        "click",
        function() {

            document.getElementById(
                "textoFiltro"
            ).value = "";

            exibirFuncionarios(funcionarios);

        }
    );

}


async function carregarFuncionarioParaAlteracao() {

    if (!codFunc || !formulario) {
        return;
    }

    try {
        const resposta = await fetch("/funcionario");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar funcionarios.");
        }

        const lista = await resposta.json();

        const funcionario = lista.find(
            item => item.codFunc == codFunc
        );

        if (!funcionario) {
            if (mensagem) mensagem.textContent = "Funcionário não encontrado.";
            return;
        }

        document.getElementById("nome").value = funcionario.nome;
        document.getElementById("cpf").value = funcionario.cpf;
        document.getElementById("email").value = funcionario.email;
        document.getElementById("data_nascimento").value = funcionario.data_nascimento;
        document.getElementById("telefone").value = funcionario.telefone;
        document.getElementById("cargo").value = funcionario.cargo;
        document.getElementById("cidade").value = funcionario.cidade;

        document.getElementById("tituloFormulario").textContent = "Alterar Funcionário";
        document.getElementById("btnSalvar").textContent = "Salvar alterações";
        document.title = "Alterar Funcionário";

    } catch (erro) {
        console.error("Erro ao carregar funcionario:", erro);

        if (mensagem) mensagem.textContent = "Não foi possível carregar os dados do funcionário.";
    }
}


carregarFuncionarios();
carregarFuncionarioParaAlteracao();