import { consumirDataDeRealizacao } from '@/domain/controllers/consome-data-realizacao'
import { db } from '@/infra/database'
import { criarAgendamentosRepository } from '@/infra/repositories/agendamentos-repository'

const criarApp = () => {
  return {
    consumirDatasDeRealizacaoSoc: consumirDataDeRealizacao,
    buscarAgendamentosPendentes: criarAgendamentosRepository({ db }).obterAgendamentosPendentes,
  }
}

export const app = criarApp()
export type AppType = typeof app
