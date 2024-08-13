import { Repositories } from './protocols'
import { db } from '@/infra/database'
import { criarAgendamentosRepository } from '@/infra/repositories/agendamentos-repository'
import { ConsumirDatasDeRealizacaoDosExames } from '@/domain/commands/consumo-soc'

const repositories: Repositories = {
  agendamentosRepository: criarAgendamentosRepository({ db }),
}

const criarApp = () => {
  const commands = {
    consumirDatasDeRealizacaoDosExames: ConsumirDatasDeRealizacaoDosExames({ repository: repositories.agendamentosRepository }),
  }

  return { ...commands }
}

export const app = criarApp()
export type AppType = typeof app
