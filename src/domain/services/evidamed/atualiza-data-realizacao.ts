import { db } from '@/infra/database'
import { ExamesPedidoExame } from '@/infra/gateway/soc/servicos/protocols'
import { criarAgendamentosRepository } from '@/infra/repositories/agendamentos-repository'
import { cirarAsoExameRepository } from '@/infra/repositories/aso-exame'
import { tryCatch, pipe, map, mapLeft, toError, chain, right } from '@/utils/Either'

export const atualizarDataRealizacaoAgendamento = (exameSoc: ExamesPedidoExame) => {
  const agendamentoRepository = criarAgendamentosRepository({ db })
  const asoExameRepository = cirarAsoExameRepository({ db })
  //console.log('atualizar exame soc: ', exameSoc)
  pipe(
    tryCatch(() => agendamentoRepository.obterCodAgendamentoCredenciadoBasePorCodSequencialResultadoSoc(exameSoc.SEQUENCIALRESULTADO), toError),
    chain((codAgendamentoCredenciadoServico) =>
      tryCatch(
        () => agendamentoRepository.atualizarDataRealizacaoExamePorCodigoSequencialResultado(exameSoc, codAgendamentoCredenciadoServico),
        toError,
      ),
    ),
    chain((codAgendamentoCredenciadoServico) => tryCatch(() => asoExameRepository.buscarASOExame(codAgendamentoCredenciadoServico), toError)),
    chain((asoExame) => {
      if (asoExame) return tryCatch(() => asoExameRepository.atualizarAsoExame(asoExame), toError)
      return right(0)
    }),
    map((qtd) => {
      console.log('qtd aso exame ' + qtd)
    }),
    mapLeft((error) => {
      console.log('erro em atualizarDataRealizacaoAgendamento: ' + error.message)
    }),
  )

  return right(true)
}
