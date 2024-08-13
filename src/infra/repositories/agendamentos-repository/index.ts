import { AgendamentosRepository } from '@/domain/protocols/repositories/agendamentos-repository'
import { Knex } from 'knex'

interface Deps {
  db: Knex
}

export const criarAgendamentosRepository = ({ db }: Deps): AgendamentosRepository => {
  return {
    async obterAgendamentosPendentes(codEmpresa?: number) {
      let query = `SELECT DISTINCT top 10 em.dscApelido, f.dscNome, acb.codSequencialFichaSOC, acb.codAgendamentoCredenciadoBase,
                em.codEmpresaSoc
                FROM agendamentoCredenciadoBase acb
                INNER JOIN agendamentoCredenciado ac on ac.codAgendamentoCredenciado = acb.codUltimoAgendamentoCredenciado 
                INNER JOIN agendamentoCredenciadoServico acs on acs.codAgendamentoCredenciado = ac.codAgendamentoCredenciado 
                LEFT JOIN atendimentoCredenciadoAso aca on aca.codAgendamentoCredenciadoBase = acb.codAgendamentoCredenciadoBase 
                INNER JOIN funcionario f on f.codfuncionario = acb.codfuncionario 
                INNER JOIN empresa em on em.codempresa = f.codempresa 
                INNER JOIN PerfilEmpresa pe on pe.codEmpresa = em.codEmpresa 
                WHERE 1 = 1
                AND pe.flgUsarIntegracaoPedidoExameSoc = 1
                AND acb.dataFichaSOC >= '01/01/2024' 
                AND acb.codSequencialFichaSOC > 0`

      if (codEmpresa) query = query + `AND em.codEmpresa IN (${codEmpresa})`

      query =
        query +
        `AND EXISTS (
          SELECT TOP 1 1 FROM agendamentoCredenciadoServico acs2 where acs2.codAgendamentoCredenciado = ac.codAgendamentoCredenciado
          AND isnull(acs.flgEncaminhar, 0) = 1
          AND isnull(acs.flgCancelado, 0) = 0
          AND acs.datRealizacao IS NULL
          AND acs.codSequencialResultadoSoc > 0
        )`

      const agendamentos = await db.raw(query)
      return agendamentos
    },
  }
}
