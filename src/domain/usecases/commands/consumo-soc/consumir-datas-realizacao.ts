import { AgendamentoProcessados } from '@/domain/entities/agendamentos'
import { AgendamentosRepository } from '../../protocols/repositories/agendamentos-repository'
import { consumirExportaDados } from '@/infra/gateway/soc/servicos/exportadados'
import { criarSoapClient } from '@/infra/gateway/soap'

type Deps = {
  repository: AgendamentosRepository
  exportaDados?: any
}

type Options = {
  codEmpresa?: number
}

type RetronoEdExame = {
  NOME: string
  CODIGO: string
}

export const ConsumirDatasDeRealizacaoDosExames = ({ repository, exportaDados }: Deps) => {
  return async (options: Options) => {
    const agendamentosProcessados: AgendamentoProcessados[] = []
    const agendamentosPendentes = await repository.obterAgendamentosPendentes(options.codEmpresa)

    if (agendamentosPendentes.length > 0) {
      agendamentosPendentes.forEach((ag) => {
        agendamentosProcessados.push({
          codAgendamentoCredenciadoBase: ag.codAgendamentoCredenciadoBase,
          status: ag.codAgendamentoCredenciadoBase === 50 ? 2 : 1,
          errors: ag.codAgendamentoCredenciadoBase === 50 ? ['Aso sem resultado no soc'] : [],
        })
      })
    }

    const parametros = {
      empresa: '414531',
      codigo: '24635',
      chave: '3c890fa79a7762d6ea98',
      tipoSaida: 'json',
    }

    const exames: RetronoEdExame[] = await consumirExportaDados({ criarSoapClient, parametros })

    exames.map((ex) =>
      console.log({
        nome: ex.NOME,
        codigo: ex.CODIGO,
      }),
    )

    return agendamentosProcessados
  }
}
