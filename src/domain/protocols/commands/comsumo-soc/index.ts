import { AgendamentoProcessados } from '@/domain/protocols/entities/agendamentos'
import { AgendamentosRepository } from '../../repositories/agendamentos-repository'

type Deps = {
  repository: AgendamentosRepository
  codEmpresa?: number
}

export interface Commands {
  consumirDatasDeRealizacaoDosExames: ({ repository, codEmpresa }: Deps) => Promise<AgendamentoProcessados[]>
}
