import { AgendamentoPendente } from '@/domain/entities/agendamentos'

export interface AgendamentosRepository {
  obterAgendamentosPendentes: (codEmpresa?: number) => Promise<AgendamentoPendente[]>
}
