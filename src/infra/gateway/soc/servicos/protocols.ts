export type ExamesPedidoExame = {
  CODIGOEMPRESA: string
  CODIGOFUNCIONARIO: string
  DATAFICHA: string
  TIPOFICHA: string
  CODIGOSEQUENCIALFICHA: string
  CODIGOEXAME: string
  NOMEFUNCIONARIO: string
  SEXO: string
  RG: string
  DATANASCIMENTO: string
  DATAADMISSAO: string
  SEQUENCIALRESULTADO: string
  DATARESULTADO: string
}

export type PedidoExameSequencialFicha = ExamesPedidoExame[]
