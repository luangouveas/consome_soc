import { AgendamentoPendente } from '@/infra/repositories/protocols'
import { chain, pipe, map, mapLeft, traverseArray } from '@/utils/Either'
import { atualizarDataRealizacaoAgendamento } from '../services/evidamed/atualiza-data-realizacao'
import { ExamesPedidoExame, PedidoExameSequencialFicha } from '@/infra/gateway/soc/servicos/protocols'
import { criarSoapClient } from '@/infra/gateway/soap'
import { consumirExportaDados } from '@/infra/gateway/soc/servicos/exportadados'

const { CODIGO_EMPRESA_PRINCIPAL, CODIGO_PEDIDOS_EXAME_SEQUENCIAL_FICHA, CHAVE_PEDIDOS_EXAME_SEQUENCIAL_FICHA } = process.env

let examesParaAtualizar: ExamesPedidoExame[] = []

const inserirExamesNaFila = (pedido: PedidoExameSequencialFicha) => {
  if (pedido.length > 0) {
    pedido.forEach((exame) => (exame.DATARESULTADO === '' ? examesParaAtualizar.push(exame) : ''))
  }
  return true
}

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
  )
}

const consultaPorAgendamento = (agendamentos: AgendamentoPendente[]) => {
  return pipe(
    agendamentos,
    traverseArray((agendamentoPendente) => {
      return pipe(
        agendamentoPendente,
        consumirPedidoExameSoc,
        map((pedido) => {
          inserirExamesNaFila(pedido)
        }),
        mapLeft(
          (error) => new Error(`Erro ao consumir o resultado do agendamento: ${agendamentoPendente.codAgendamentoCredenciadoBase}: ${error.message}`),
        ),
      )
    }),
    map(() => examesParaAtualizar),
    mapLeft((error) => error),
  )
}

const atualizarListaDeExamesPendentes = (examesParaAtualizar: ExamesPedidoExame[]) => {
  console.log('Exames para atualizar: ', examesParaAtualizar.length)
  return pipe(
    examesParaAtualizar,
    traverseArray((exame) => {
      return pipe(exame, atualizarDataRealizacaoAgendamento)
    }),
    map(() => examesParaAtualizar),
  )
}

export const consumirDataDeRealizacao = (agendamentos: AgendamentoPendente[]) => {
  console.log(`Agendamentos em aberto: ${agendamentos.length}`)
  return pipe(
    agendamentos,
    consultaPorAgendamento,
    chain((examesParaAtualizar) => atualizarListaDeExamesPendentes(examesParaAtualizar)),
    map(() => examesParaAtualizar),
    mapLeft((error) => error),
  )
}
