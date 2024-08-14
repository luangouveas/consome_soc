import { AgendamentoPendente, AgendamentoProcessados } from '@/domain/protocols/entities/agendamentos'
import { AgendamentosRepository } from '../../protocols/repositories/agendamentos-repository'
import { consumirExportaDados } from '@/infra/gateway/soc/servicos/exportadados'
import { criarSoapClient } from '@/infra/gateway/soap'
import { PedidoExameSequencialFicha } from '@/infra/gateway/soc/servicos/protocols'

import { tryCatch, chain, pipe, map, mapLeft, toError, sequenceArray, right } from '@/utils/Either'

type Deps = {
  repository: AgendamentosRepository
  exportaDados?: any
}

type Options = {
  codEmpresa?: number
}

const { CODIGO_EMPRESA_PRINCIPAL, CODIGO_PEDIDOS_EXAME_SEQUENCIAL_FICHA, CHAVE_PEDIDOS_EXAME_SEQUENCIAL_FICHA } = process.env

const atualizaRegistro = async (exames: PedidoExameSequencialFicha[]) => {
  console.log()
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
    consumirExportaDados({ criarSoapClient, parametros }),
    map((exames: PedidoExameSequencialFicha[]) => {
      if (exames.length > 0) {
        return pipe(
          tryCatch(() => atualizaRegistro(exames), toError),
          map((res) => {
            console.log(res)
            return agendamento
          }),
        )
      }
      return right(null)
    }),
    mapLeft((err) => console.log(err.message)),
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
      mapLeft(() => console.log('teve erro')),
    )()
  }
}
