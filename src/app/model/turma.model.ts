// src/app/model/turma.model.ts

export class Turma {
  id: number;
  nome: string;
  codigo: string;
  descricao: string;
  imagem?: string;
  ano: number;
  nivelEnsino: string;
  dataCriacao: string;
  disciplinaId: number;
  disciplinaNome: string;
  quantidadeAlunos?: number;
  quantidadeProfessores?: number;
  quantidadeAtividades?: number;

  constructor(
    id: number = 0,
    nome: string = '',
    codigo: string = '',
    descricao: string = '',
    imagem: string = '',
    ano: number = new Date().getFullYear(), // Define o ano atual como padrão
    nivelEnsino: string = '',
    dataCriacao: string = '',
    disciplinaId: number = 0,
    disciplinaNome: string = '',
    quantidadeAlunos: number = 0,
    quantidadeProfessores: number = 0,
    quantidadeAtividades: number = 0
  ) {
    this.id = id;
    this.nome = nome;
    this.codigo = codigo;
    this.descricao = descricao;
    this.imagem = imagem;
    this.ano = ano;
    this.nivelEnsino = nivelEnsino;
    this.dataCriacao = dataCriacao;
    this.disciplinaId = disciplinaId;
    this.disciplinaNome = disciplinaNome;
    this.quantidadeAlunos = quantidadeAlunos;
    this.quantidadeProfessores = quantidadeProfessores;
    this.quantidadeAtividades = quantidadeAtividades;
  }
}

export class TurmaWithUsuario extends Turma {
  usuarioId: number;
  dataEntrada: string;
  ativo: boolean;
  favorito: boolean;

  constructor(
    // Parâmetros da classe pai (Turma)
    id: number = 0,
    nome: string = '',
    codigo: string = '',
    descricao: string = '',
    imagem: string = '',
    ano: number = new Date().getFullYear(),
    nivelEnsino: string = '',
    dataCriacao: string = '',
    disciplinaId: number = 0,
    disciplinaNome: string = '',
    quantidadeAlunos: number = 0,
    quantidadeProfessores: number = 0,
    quantidadeAtividades: number = 0,
    // Parâmetros específicos de TurmaWithUsuario
    usuarioId: number = 0,
    dataEntrada: string = '',
    ativo: boolean = true,
    favorito: boolean = false
  ) {
    // Inicializa os atributos herdados de Turma
    super(
      id,
      nome,
      codigo,
      descricao,
      imagem,
      ano,
      nivelEnsino,
      dataCriacao,
      disciplinaId,
      disciplinaNome,
      quantidadeAlunos,
      quantidadeProfessores,
      quantidadeAtividades
    );
    
    // Inicializa os atributos próprios
    this.usuarioId = usuarioId;
    this.dataEntrada = dataEntrada;
    this.ativo = ativo;
    this.favorito = favorito;
  }
}