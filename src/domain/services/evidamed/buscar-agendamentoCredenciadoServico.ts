import { tryCatch, pipe, map, mapLeft, toError, chain } from '@/utils/Either'
import { criarAgendamentosRepository } from '@/infra/repositories/agendamentos-repository'
import { db } from '@/infra/database'

export const buscarCodAgendamentoCredenciadoBasePorCodSequencialResultadoSoc = (codSequencialResultadoSoc: string) => {
  const agendamentoRepository = criarAgendamentosRepository({ db })
  return pipe(
    tryCatch(() => agendamentoRepository.obterCodAgendamentoCredenciadoBasePorCodSequencialResultadoSoc(codSequencialResultadoSoc), toError),
  )
}
