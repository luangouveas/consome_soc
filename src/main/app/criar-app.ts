import { Repositories } from '@/app/protocols'
import { criarAgendamentosRepository } from '@/infra/repositories/agendamentos-repository'
import { db } from '@/infra/database'
import { App } from '@/app'

const repositories: Repositories = {
  agendamentosRepository: criarAgendamentosRepository({ db }),
}

export const criarApp = () => {
  return App(repositories)
}
