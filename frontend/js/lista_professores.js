document.addEventListener("DOMContentLoaded", carregarProfessores);

async function carregarProfessores() {
    const corpoTabela = document.getElementById("corpo-tabela-professores");

    try {
        const resposta = await fetch("/professor");
        if (!resposta.ok) throw new Error("Erro ao carregar lista de professores.");

        const professores = await resposta.json();
        corpoTabela.innerHTML = "";

        if (professores.length === 0) {
            corpoTabela.innerHTML = "<tr><td colspan='7'>Nenhum professor cadastrado.</td></tr>";
            return;
        }

        professores.forEach(prof => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${prof.codProf}</td>
                <td>${prof.nome}</td>
                <td>${prof.cpf}</td>
                <td>${prof.email}</td>
                <td>${prof.data_nascimento}</td>
                <td>${prof.telefone}</td>
                <td>${prof.cidade}</td>
            `;
            corpoTabela.appendChild(linha);
        });
    } catch (erro) {
        console.error("Erro:", erro);
        corpoTabela.innerHTML = "<tr><td colspan='7'>Erro ao carregar os dados.</td></tr>";
    }
}