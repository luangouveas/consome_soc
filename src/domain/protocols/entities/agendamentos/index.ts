export type AgendamentoPendente = {
  dscApelido: string
  dscNome: string
  codSequencialFichaSOC: number
  codAgendamentoCredenciadoBase: number
  codEmpresaSoc: number
}

// 1 OK || 2 ERROR
export type AgendamentoProcessados = {
  codAgendamentoCredenciadoBase: number
  status: number
  errors?: string[]
}
