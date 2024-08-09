export type AgendamentoPendente = {
  codAgendamentoCredenciadoBase: number
}

// 1 OK || 2 ERROR
export type AgendamentoProcessados = {
  codAgendamentoCredenciadoBase: number
  status: number
  errors?: string[]
}
