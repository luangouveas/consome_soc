import { chain, pipe, map, mapLeft, traverseArray, right, left } from '@/utils/Either'
import { consumirExportaDados } from '@/infra/gateway/soc/servicos/exportadados'
import { criarSoapClient } from '@/infra/gateway/soap'
import { AgendamentoPendente } from '@/infra/repositories/agendamentos-repository/protocols'
import { ExamesPedidoExame, PedidoExameSequencialFicha } from '@/infra/gateway/soc/servicos/protocols'
import { atualizarDataRealizacaoAgendamento } from '../../services/evidamed/atualiza-data-realizacao'

type RetornoAgendamento = {
  codAgendamentoCredenciadoBase: number
  errors: string[]
}

const AgendamentosRetorno: RetornoAgendamento[] = []

const atualizarDataRealizacaoPorPedidoExameSoc = (pedidoExameSoc: PedidoParaAtualizar) => {
  let temExameSemData = false
  const examesDoPedido = pedidoExameSoc.examesDoPedido

  return pipe(
    examesDoPedido,
    traverseArray((exame) => {
      if (exame.DATARESULTADO === '') {
        temExameSemData = true
        return right(true)
      } else {
        return pipe(exame, atualizarDataRealizacaoAgendamento)
      }
    }),
    map(() => {
      let retornoAgendamento: RetornoAgendamento = {
        codAgendamentoCredenciadoBase: pedidoExameSoc.codAgendamentoCredenciadoBase,
        errors: [],
      }

      if (temExameSemData) {
        retornoAgendamento.errors.push('Existem exames sem data de realização no SOC')
      }

      AgendamentosRetorno.push(retornoAgendamento)
    }),
  )
}

type PedidoParaAtualizar = {
  codAgendamentoCredenciadoBase: number
  examesDoPedido: ExamesPedidoExame[]
}

const atualizarDataRealizacaoPorListaPedidoExameSoc = (pedidosExameSoc: readonly PedidoParaAtualizar[]) => {
  return traverseArray(atualizarDataRealizacaoPorPedidoExameSoc)(pedidosExameSoc)
}

const { CODIGO_EMPRESA_PRINCIPAL, CODIGO_PEDIDOS_EXAME_SEQUENCIAL_FICHA, CHAVE_PEDIDOS_EXAME_SEQUENCIAL_FICHA } = process.env

const consumirPedidoExameSoc = (agendamentoPendente: AgendamentoPendente) => {
  const parametros = {
    empresa: CODIGO_EMPRESA_PRINCIPAL,
    codigo: CODIGO_PEDIDOS_EXAME_SEQUENCIAL_FICHA,
    chave: CHAVE_PEDIDOS_EXAME_SEQUENCIAL_FICHA,
    tipoSaida: 'json',
    sequencial: agendamentoPendente.codSequencialFichaSOC,
    empresaTrabalho: agendamentoPendente.codEmpresaSoc,
  }

  return pipe(
    consumirExportaDados({ criarSoapClient, parametros }),
    map((pedido: PedidoExameSequencialFicha) => pedido),
    mapLeft((err) => {
      const msgErro = `Ocorreu erro ao tentar consumir pedido de exame do agendamento ${agendamentoPendente.codAgendamentoCredenciadoBase}`
      return new Error(msgErro)
    }),
  )
}

const consomePedidoExameSocPorAgendamento = (agendamentosPendentes: AgendamentoPendente[]) => {
  return pipe(
    agendamentosPendentes,
    traverseArray((agendamentoPendente) => {
      return pipe(
        agendamentoPendente,
        consumirPedidoExameSoc,
        map((pedidoExame) => {
          const pedido: PedidoParaAtualizar = {
            codAgendamentoCredenciadoBase: agendamentoPendente.codAgendamentoCredenciadoBase,
            examesDoPedido: pedidoExame,
          }

          return pedido
        }),
        mapLeft((err) => {
          AgendamentosRetorno.push({
            codAgendamentoCredenciadoBase: agendamentoPendente.codAgendamentoCredenciadoBase,
            errors: [err.message],
          })
          return undefined as never
        }),
      )
    }),
  )
}

export const consumirDataRealizacaoAgendamentosPendentes = (agendamentosPendentes: AgendamentoPendente[]) => {
  console.log(`Agendamentos em aberto: ${agendamentosPendentes.length}`)
  console.log(agendamentosPendentes)
  return pipe(
    agendamentosPendentes,
    consomePedidoExameSocPorAgendamento,
    chain((pedidosExameSoc) => atualizarDataRealizacaoPorListaPedidoExameSoc(pedidosExameSoc)),
    map(() => AgendamentosRetorno),
  )
}
