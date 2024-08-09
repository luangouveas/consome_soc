import { AgendamentoProcessados } from '@/domain/entities/agendamentos'
import { AgendamentosRepository } from '../../repositories/agendamentos-repository'

type Deps = {
  repository: AgendamentosRepository
  codEmpresa?: number
}

export interface Commands {
  consumirDatasDeRealizacaoDosExames: ({ repository, codEmpresa }: Deps) => Promise<AgendamentoProcessados[]>
}
