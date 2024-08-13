import { AgendamentoPendente, AgendamentoProcessados } from '@/domain/protocols/entities/agendamentos'
import { AgendamentosRepository } from '../../protocols/repositories/agendamentos-repository'
import { consumirExportaDados } from '@/infra/gateway/soc/servicos/exportadados'
import { criarSoapClient } from '@/infra/gateway/soap'
import { PedidoExameSequencialFicha } from '@/infra/gateway/soc/servicos/protocols'

import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import { traverseWithIndex } from 'fp-ts/ReadonlyArray'
import { sequenceT } from 'fp-ts/lib/Apply'

type Deps = {
  repository: AgendamentosRepository
  exportaDados?: any
}

type Options = {
  codEmpresa?: number
}

const { CODIGO_EMPRESA_PRINCIPAL, CODIGO_PEDIDOS_EXAME_SEQUENCIAL_FICHA, CHAVE_PEDIDOS_EXAME_SEQUENCIAL_FICHA } = process.env

const atualizaRegistro = (exames: PedidoExameSequencialFicha[]) => {
  if (exames) {
    return true
  }
  return false
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

  return pipe(
    { criarSoapClient, parametros },
    consumirExportaDados,
    TE.chain((exames: PedidoExameSequencialFicha[]) => {
      return pipe(
        TE.tryCatch(async () => atualizaRegistro(exames), E.toError),
        TE.map((res) => (res ? [agendamento] : [])),
      )
    }),
  )
}

const consulteResultadoNoSoc = (agendamentos: AgendamentoPendente[]) => {
  const consultas = agendamentos.map(consultaAtualizaResultadoFichaSoc)
  return TE.sequenceArray(consultas)
}

export const ConsumirDatasDeRealizacaoDosExames = ({ repository }: Deps) => {
  return async (options: Options) => {
    const agendamentosPendentes = await repository.obterAgendamentosPendentes(options.codEmpresa)

    console.log(`Agendamentos pendentes: ${agendamentosPendentes.length}`)

    return pipe(
      agendamentosPendentes,
      consulteResultadoNoSoc,
      TE.map((listaDeAgendamentosAtualizados) => {
        const flattenLista = listaDeAgendamentosAtualizados.flat()
        console.log(flattenLista) //tem que retornar o array so com 1 agendamento, pois os outros 2 nao existem no soc, portanto nao serao processados no evida
        return flattenLista
      }),
    )()
  }
}
