Markdown

# 🏫 Sistema de Gestão Escolar - API REST & Frontend

Um sistema web completo para gerenciamento acadêmico e administrativo, desenvolvido com **FastAPI**, **MySQL** e **JavaScript puro**. O projeto oferece um CRUD estruturado para o cadastro e a listagem de **Alunos**, **Professores** e **Funcionários**.

---

## 🚀 Tecnologias Utilizadas

* **Backend:** Python 3 + FastAPI
* **Validação de Dados:** Pydantic
* **Banco de Dados:** MySQL
* **Frontend:** HTML5, JavaScript (ES6+) e CSS3
* **Servidor Web:** Uvicorn

---

## 🗄️ Banco de Dados (MySQL)

Crie o banco de dados e as tabelas executando o script SQL abaixo no seu MySQL Workbench ou DBeaver:

```sql
-- 
CREATE DATABASE escola;
use escola;

CREATE TABLE `alunos` (
  `codAluno` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `email` varchar(150) NOT NULL,
  `data_nascimento` date NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `ra` varchar(10) NOT NULL,
  `cidade` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `alunos`
  ADD PRIMARY KEY (`codAluno`),
  ADD UNIQUE KEY `cpf` (`cpf`),
  ADD UNIQUE KEY `ra` (`ra`);
  
  select * from alunos;
  drop table alunos;
  
  CREATE TABLE `professor` (
  `codProf` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `email` varchar(150) NOT NULL,
  `data_nascimento` date NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `cidade` varchar(50) NOT NULL,
  PRIMARY KEY (`codProf`),
  UNIQUE KEY `cpf` (`cpf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `funcionario` (
  `codFunc` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `cpf` VARCHAR(14) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `data_nascimento` DATE NOT NULL,
  `telefone` VARCHAR(20) NOT NULL,
  `cargo` VARCHAR(50) NOT NULL,
  `cidade` varchar(50) NOT NULL,
  PRIMARY KEY (`codFunc`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
````
📌 Rotas da API (Endpoints)
🎓 Alunos

    GET /alunos — Lista todos os alunos cadastrados.

    POST /alunos — Cadastra um novo aluno.

👨‍🏫 Professores

    GET /professor — Lista todos os professores cadastrados.

    POST /professor — Cadastra um novo professor.

💼 Funcionários

    GET /funcionario — Lista todos os funcionários cadastrados.

    POST /funcionario — Cadastra um novo funcionário.

🛠️ Como Executar o Projeto

    Clone o repositório:
    Bash

    git clone [https://github.com/DaniellMarquez/Escola-Fast-Api.git](https://github.com/DaniellMarquez/Escola-Fast-Api.git)
    cd Escola-Fast-Api

    Crie e ative o ambiente virtual:
    Bash

    python3 -m venv .venv
    source .venv/bin/activate  # Linux/Mac
    # .venv\Scripts\activate   # Windows

    Instale as dependências:
    Bash

    pip install fastapi uvicorn mysql-connector-python pydantic

    Inicie o servidor backend:
    Bash

    uvicorn src.main:app --reload

    Acesse a aplicação:

        Interface Web: http://127.0.0.1:8000

        Documentação Swagger (API): http://127.0.0.1:8000/docs

👤 Autor

Desenvolvido por Daniel Marques.
