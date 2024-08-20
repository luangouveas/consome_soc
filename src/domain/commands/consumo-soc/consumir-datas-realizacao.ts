import { AgendamentoPendente, AgendamentoProcessados } from '@/domain/protocols/entities/agendamentos'
import { AgendamentosRepository } from '../../protocols/repositories/agendamentos-repository'
import { consumirExportaDados } from '@/infra/gateway/soc/servicos/exportadados'
import { criarSoapClient } from '@/infra/gateway/soap'
import { PedidoExameSequencialFicha } from '@/infra/gateway/soc/servicos/protocols'

import { chain, pipe, map, mapLeft, sequenceArray, right } from '@/utils/Either'

type Deps = {
  repository: AgendamentosRepository
  exportaDados?: any
}

type Options = {
  codEmpresa?: number
}

const { CODIGO_EMPRESA_PRINCIPAL, CODIGO_PEDIDOS_EXAME_SEQUENCIAL_FICHA, CHAVE_PEDIDOS_EXAME_SEQUENCIAL_FICHA } = process.env

const atualizar = (exame: PedidoExameSequencialFicha) => {
  return exame
}

const consultaAtualizaResultadoFichaSoc = (agendamento: AgendamentoPendente) => {
  const parametros = {
    empresa: CODIGO_EMPRESA_PRINCIPAL,
    codigo: CODIGO_PEDIDOS_EXAME_SEQUENCIAL_FICHA,
    chave: CHAVE_PEDIDOS_EXAME_SEQUENCIAL_FICHA,
    tipoSaida: 'json',
    sequencial: agendamento.codSequencialFichaSOC,
    empresaTrabalho: agendamento.codEmpresaSoc,
  }

  let agendamentoProcessado: AgendamentoProcessados = {
    codAgendamentoCredenciadoBase: agendamento.codAgendamentoCredenciadoBase,
    status: 1,
    errors: [],
  }

  return pipe(
    consumirExportaDados({ criarSoapClient, parametros }),
    chain((exames: PedidoExameSequencialFicha[]) => {
      if (exames instanceof Error) {
        agendamentoProcessado.status = 2
        agendamentoProcessado.errors?.push(
          `Erro ao consumir datas de realização do agendamento ${agendamento.codAgendamentoCredenciadoBase}: ${exames.message}`,
        )
        return right(agendamentoProcessado)
      }

      if (exames.length > 0) {
        const examesAtualizados = exames.map(atualizar)
      } else {
        agendamentoProcessado.status = 2
        agendamentoProcessado.errors?.push(`Agendamento ${agendamento.codAgendamentoCredenciadoBase} sem exames com resultado no SOC`)
      }

      return right(agendamentoProcessado)
    }),
  )
}

const consulteResultadoNoSoc = (agendamentos: AgendamentoPendente[]) => {
  const agendamentosConsultados = agendamentos.map(consultaAtualizaResultadoFichaSoc)
  return sequenceArray(agendamentosConsultados)
}

export const ConsumirDatasDeRealizacaoDosExames = ({ repository }: Deps) => {
  return async (options: Options) => {
    const agendamentosPendentes = await repository.obterAgendamentosPendentes(options.codEmpresa)

    console.log(`Agendamentos pendentes: ${agendamentosPendentes.length}`)

    return pipe(
      agendamentosPendentes,
      consulteResultadoNoSoc,
      map((listaDeAgendamentosAtualizados) => {
        const flattenLista = listaDeAgendamentosAtualizados.flat().filter((ag) => ag)
        return flattenLista
      }),
      mapLeft((err) => console.log(err.message)),
    )()
  }
}
