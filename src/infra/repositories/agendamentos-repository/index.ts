import { AgendamentosRepository } from '@/domain/usecases/protocols/repositories/agendamentos-repository'
import { Knex } from 'knex'

interface Deps {
  db: Knex
}

export const criarAgendamentosRepository = ({ db }: Deps): AgendamentosRepository => {
  return {
    async obterAgendamentosPendentes(codEmpresa?: number) {
      const agendamentos = await db.raw(`
                select top 2 acb.codAgendamentoCredenciadoBase
                from AgendamentoCredenciadoBase acb
                where 1=1 `)
      return agendamentos
    },
  }
}
