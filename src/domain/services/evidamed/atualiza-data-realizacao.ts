import { db } from '@/infra/database'
import { ExamesPedidoExame } from '@/infra/gateway/soc/servicos/protocols'
import { criarAgendamentosRepository } from '@/infra/repositories/agendamentos-repository'
import { tryCatch, pipe, map, mapLeft, toError } from '@/utils/Either'

export const atualizarDataRealizacaoAgendamento = (examesSoc: ExamesPedidoExame) => {
  const repository = criarAgendamentosRepository({ db })
  return pipe(
    tryCatch(() => repository.atualizarDataRealizacaoExamePorCodigoSequencialResultado(examesSoc), toError),
    map(() => true),
    mapLeft((error) => error),
  )
}
