from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from mysql.connector import IntegrityError

from database import criar_conexao
from schemas import (
    AlunoCreate, AlunoResponse,
    ProfessorCreate, ProfessorResponse,
    FuncionarioCreate, FuncionarioResponse
)

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

app.mount("/frontend", StaticFiles(directory=FRONTEND_DIR), name="frontend")

# Pagina Inicial
@app.get("/", include_in_schema=False)
def pagina_inicial():
    return FileResponse(FRONTEND_DIR / "index.html")

# Rotas de Cadastro
@app.get("/cadastro-de-aluno", include_in_schema=False)
def pagina_cadastro_aluno():
    return FileResponse(FRONTEND_DIR / "cadastrodealuno.html")

@app.get("/cadastro-de-professor", include_in_schema=False)
def pagina_cadastro_professor():
    return FileResponse(FRONTEND_DIR / "cadastrodeprofessor.html")

@app.get("/cadastro-de-funcionario", include_in_schema=False)
def pagina_cadastro_funcionario():
    return FileResponse(FRONTEND_DIR / "cadastrodefuncionario.html")

# Rotas de Listagem
@app.get("/lista-de-alunos", include_in_schema=False)
def pagina_lista_alunos():
    return FileResponse(FRONTEND_DIR / "listadealunos.html")

@app.get("/lista-de-professores", include_in_schema=False)
def pagina_lista_professores():
    return FileResponse(FRONTEND_DIR / "listadeprofessores.html")

@app.get("/lista-de-funcionarios", include_in_schema=False)
def pagina_lista_funcionarios():
    return FileResponse(FRONTEND_DIR / "listadefuncionarios.html")

# ================= ALUNOS =================

@app.get("/alunos", response_model=list[AlunoResponse])
def listar_alunos():
    conexao = criar_conexao()
    cursor = conexao.cursor()
    cursor.execute("SELECT * FROM alunos")
    registros = cursor.fetchall()
    cursor.close()
    conexao.close()

    alunos = []
    for registro in registros:
        aluno = {
            "codAluno": registro[0],
            "nome": registro[1],
            "cpf": registro[2],
            "email": registro[3],
            "data_nascimento": registro[4],
            "telefone": registro[5],
            "ra": registro[6],
            "cidade": registro[7]
        }
        alunos.append(aluno)

    return alunos


@app.post("/alunos", response_model=AlunoResponse)
def cadastrar_aluno(aluno: AlunoCreate):
    conexao = criar_conexao()
    cursor = conexao.cursor()

    sql = """
        INSERT INTO alunos
        (nome, cpf, email, data_nascimento, telefone, ra, cidade)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    valores = (
        aluno.nome, aluno.cpf, aluno.email,
        aluno.data_nascimento, aluno.telefone,
        aluno.ra, aluno.cidade
    )

    try:
        cursor.execute(sql, valores)
        conexao.commit()
        id_aluno = cursor.lastrowid

        return {
            "id": id_aluno,
            "nome": aluno.nome,
            "cpf": aluno.cpf,
            "email": aluno.email,
            "data_nascimento": aluno.data_nascimento,
            "telefone": aluno.telefone,
            "ra": aluno.ra,
            "cidade": aluno.cidade
        }
    except IntegrityError as erro:
        conexao.rollback()
        if erro.errno == 1062:
            raise HTTPException(status_code=409, detail="CPF já cadastrado.")
        raise HTTPException(status_code=500, detail="Erro de integridade no banco de dados.")
    finally:
        cursor.close()
        conexao.close()


# ================= PROFESSORES =================

@app.get("/professor", response_model=list[ProfessorResponse])
def listar_professor():
    conexao = criar_conexao()
    cursor = conexao.cursor()
    cursor.execute("SELECT * FROM professor")
    registros = cursor.fetchall()
    cursor.close()
    conexao.close()

    professores = []
    for registro in registros:
        professor = {
            "codProf": registro[0],
            "nome": registro[1],
            "cpf": registro[2],
            "email": registro[3],
            "data_nascimento": registro[4],
            "telefone": registro[5],
            "cidade": registro[6]
        }
        professores.append(professor)

    return professores


@app.post("/professor", response_model=ProfessorResponse)
def cadastrar_professor(professor: ProfessorCreate):
    conexao = criar_conexao()
    cursor = conexao.cursor()

    sql = """
        INSERT INTO professor
        (nome, cpf, email, data_nascimento, telefone, cidade)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    valores = (
        professor.nome,
        professor.cpf,
        professor.email,
        professor.data_nascimento,
        professor.telefone,
        professor.cidade
    )

    try:
        cursor.execute(sql, valores)
        conexao.commit()
        id_prof = cursor.lastrowid

        return {
            "codProf": id_prof,
            "nome": professor.nome,
            "cpf": professor.cpf,
            "email": professor.email,
            "data_nascimento": professor.data_nascimento,
            "telefone": professor.telefone,
            "cidade": professor.cidade
        }
    except IntegrityError as erro:
        conexao.rollback()
        if erro.errno == 1062:
            raise HTTPException(status_code=409, detail="CPF ou E-mail já cadastrado.")
        raise HTTPException(status_code=500, detail="Erro de integridade no banco de dados.")
    finally:
        cursor.close()
        conexao.close()


# ================= FUNCIONÁRIOS =================

@app.get("/funcionario", response_model=list[FuncionarioResponse])
def listar_funcionario():
    conexao = criar_conexao()
    cursor = conexao.cursor()
    cursor.execute("SELECT * FROM funcionario")
    registros = cursor.fetchall()
    cursor.close()
    conexao.close()

    lista_funcionarios = []
    for registro in registros:
        item = {
            "codFunc": registro[0],
            "nome": registro[1],
            "cpf": registro[2],
            "email": registro[3],
            "data_nascimento": registro[4],
            "telefone": registro[5],
            "cidade": registro[6],
            "cargo": registro[7]
        }
        lista_funcionarios.append(item)

    return lista_funcionarios


@app.post("/funcionario", response_model=FuncionarioResponse)
def cadastrar_funcionario(funcionario: FuncionarioCreate):
    conexao = criar_conexao()
    cursor = conexao.cursor()

    sql = """
        INSERT INTO funcionario
        (nome, cpf, email, data_nascimento, telefone, cidade, cargo)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    valores = (
        funcionario.nome,
        funcionario.cpf,
        funcionario.email,
        funcionario.data_nascimento,
        funcionario.telefone,
        funcionario.cidade,
        funcionario.cargo
    )

    try:
        cursor.execute(sql, valores)
        conexao.commit()
        id_func = cursor.lastrowid

        return {
            "codFunc": id_func,
            "nome": funcionario.nome,
            "cpf": funcionario.cpf,
            "email": funcionario.email,
            "data_nascimento": funcionario.data_nascimento,
            "telefone": funcionario.telefone,
            "cidade": funcionario.cidade,
            "cargo": funcionario.cargo
        }
    except IntegrityError as erro:
        conexao.rollback()
        if erro.errno == 1062:
            raise HTTPException(status_code=409, detail="CPF ou E-mail já cadastrado.")
        raise HTTPException(status_code=500, detail="Erro de integridade no banco de dados.")
    finally:
        cursor.close()
        conexao.close()