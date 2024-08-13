import { AgendamentoPendente } from '@/domain/protocols/entities/agendamentos'

export interface AgendamentosRepository {
  obterAgendamentosPendentes: (codEmpresa?: number) => Promise<AgendamentoPendente[]>
}
