document.addEventListener("DOMContentLoaded", carregarAlunos);

async function carregarAlunos() {
    const corpoTabela = document.getElementById("corpo-tabela-alunos");

    try {
        const resposta = await fetch("/alunos");
        if (!resposta.ok) throw new Error("Erro ao carregar lista de alunos.");

        const alunos = await resposta.json();
        corpoTabela.innerHTML = "";

        if (alunos.length === 0) {
            corpoTabela.innerHTML = "<tr><td colspan='8'>Nenhum aluno cadastrado.</td></tr>";
            return;
        }

        alunos.forEach(aluno => {
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
            corpoTabela.appendChild(linha);
        });
    } catch (erro) {
        console.error("Erro:", erro);
        corpoTabela.innerHTML = "<tr><td colspan='8'>Erro ao carregar os dados.</td></tr>";
    }
}