const formulario = document.getElementById("form-aluno");
const mensagem = document.getElementById("mensagem");

if (formulario) {
    formulario.addEventListener("submit", async function(evento) {
        evento.preventDefault();

        if (mensagem) mensagem.textContent = "";

        const aluno = {
            nome: document.getElementById("nome")?.value,
            cpf: document.getElementById("cpf")?.value,
            email: document.getElementById("email")?.value,
            data_nascimento: document.getElementById("data_nascimento")?.value,
            telefone: document.getElementById("telefone")?.value,
            ra: document.getElementById("ra")?.value,
            cidade: document.getElementById("cidade")?.value
        };

        try {
            const resposta = await fetch("/alunos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(aluno)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                if (mensagem) mensagem.textContent = "Aluno cadastrado com sucesso!";
                formulario.reset();
                console.log("Aluno cadastrado:", resultado);
            } else {
                if (mensagem) mensagem.textContent = "Erro ao cadastrar aluno: " + obterMensagemErro(resultado);
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

                if (campo === "ra") {
                    return "RA inválido.";
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
let alunos = [];

async function carregarAlunos() {

    const tabela = document.getElementById("listaAlunos");

    if (!tabela) {
        return;
    }

    try {

        const resposta = await fetch("/alunos");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar alunos.");
        }

        alunos = await resposta.json();

        exibirAlunos(alunos);

    } catch (erro) {

        console.error("Erro ao carregar alunos:", erro);

        tabela.innerHTML = `
            <tr>
                <td colspan="8">
                    Erro ao carregar os alunos.
                </td>
            </tr>
        `;
    }
}


function exibirAlunos(listaAlunos) {

    const tabela = document.getElementById("listaAlunos");

    if (!tabela) {
        return;
    }

    tabela.innerHTML = "";

    listaAlunos.forEach(aluno => {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${aluno.codAluno}</td>
            <td>${aluno.nome}</td>
            <td>${aluno.cpf}</td>
            <td>${aluno.email}</td>
            <td>${aluno.data_nascimento}</td>
            <td>${aluno.telefone}</td>
            <td>${aluno.ra}</td>
            <td>${aluno.cidade}</td>
        `;

        tabela.appendChild(linha);

    });
}


function filtrarAlunos() {

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

    const alunosFiltrados = alunos.filter(aluno => {

        const valor = aluno[campo];

        if (valor === null || valor === undefined) {
            return false;
        }

        return String(valor)
            .toLowerCase()
            .includes(texto);

    });

    exibirAlunos(alunosFiltrados);
}


const textoFiltro =
    document.getElementById("textoFiltro");

if (textoFiltro) {

    textoFiltro.addEventListener(
        "input",
        filtrarAlunos
    );

}


const campoFiltro =
    document.getElementById("campoFiltro");

if (campoFiltro) {

    campoFiltro.addEventListener(
        "change",
        filtrarAlunos
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

            exibirAlunos(alunos);

        }
    );

}


carregarAlunos();