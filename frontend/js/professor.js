const formulario = document.getElementById("form-professor");
const mensagem =  document.getElementById("mensagem");

formulario.addEventListener("submit", async function(evento){
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
    try{
        const resposta = await fetch("/professor",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(professor)
            });
        const resultado = await resposta.json();
        if(resposta.ok){
            mensagem.textContent = "professor cadastrado com sucesso";
            formulario.reset();

        }else{
            mensagem.textContent = "erro ao cadastrar professor" + obterMensagemErro(resultado);
            console.error("erro de api:", resultado)
        }

    }catch (erro) {
        mensagem.textContent = "nao foi possivel conectar ao servidor."
        console.error("erro de conexao ", erro);
    
    }
});
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