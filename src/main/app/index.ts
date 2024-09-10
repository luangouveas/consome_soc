import { consumirDataRealizacaoAgendamentosPendentes } from '@/domain/controllers/agendamento/data-realizacao.controller'
import { db } from '@/infra/database'
import { criarAgendamentosRepository } from '@/infra/repositories/agendamentos-repository'

const criarApp = () => {
  return {
    consumirDatasDeRealizacaoSoc: consumirDataRealizacaoAgendamentosPendentes,
    buscarAgendamentosPendentes: criarAgendamentosRepository({ db }).obterAgendamentosPendentes,
  }
}

export const app = criarApp()
export type AppType = typeof app
