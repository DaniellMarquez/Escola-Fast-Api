document.addEventListener("DOMContentLoaded", carregarFuncionarios);

async function carregarFuncionarios() {
    const corpoTabela = document.getElementById("corpo-tabela");

    try {
        const resposta = await fetch("/funcionario");
        
        if (!resposta.ok) {
            throw new Error("Erro ao carregar lista de funcionários.");
        }

        const funcionarios = await resposta.json();

        corpoTabela.innerHTML = "";

        if (funcionarios.length === 0) {
            corpoTabela.innerHTML = "<tr><td colspan='8'>Nenhum funcionário cadastrado.</td></tr>";
            return;
        }

        funcionarios.forEach(func => {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${func.codFunc}</td>
                <td>${func.nome}</td>
                <td>${func.cpf}</td>
                <td>${func.email}</td>
                <td>${func.data_nascimento}</td>
                <td>${func.telefone}</td>
                <td>${func.cidade}</td>
                <td>${func.cargo}</td>
            `;

            corpoTabela.appendChild(linha);
        });

    } catch (erro) {
        console.error("Erro:", erro);
        corpoTabela.innerHTML = "<tr><td colspan='8'>Erro ao carregar os dados.</td></tr>";
    }
}