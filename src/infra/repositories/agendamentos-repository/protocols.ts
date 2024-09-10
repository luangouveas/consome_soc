import { ExamesPedidoExame } from '@/infra/gateway/soc/servicos/protocols'

export type AgendamentoPendente = {
  dscApelido: string
  dscNome: string
  codSequencialFichaSOC: number
  codAgendamentoCredenciadoBase: number
  codEmpresaSoc: number
}

export interface AgendamentosRepository {
  obterAgendamentosPendentes: (codEmpresa?: number) => Promise<AgendamentoPendente[]>
  obterCodAgendamentoCredenciadoBasePorCodSequencialResultadoSoc: (codSequencialResultadoSoc: string) => Promise<number>
  atualizarDataRealizacaoExamePorCodigoSequencialResultado: (
    ResultadoExameSoc: ExamesPedidoExame,
    codAgendamentoCredenciadoServico: number,
  ) => Promise<number>
}
