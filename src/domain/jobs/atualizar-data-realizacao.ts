import { Job } from './protocols'
import { AppType } from '../../main/app'
import { tryCatch, chain, pipe, map, mapLeft, toError, sequenceArray, right, traverseArray } from '@/utils/Either'

export const AtualizarDataRealizacaoJob: Job = {
  name: 'AtualizarDataRealizacaoJob',
  frequence: '',
  active: true,
  handle: async (app: AppType) => {
    const codEmpresa = 11

    pipe(
      tryCatch(() => app.buscarAgendamentosPendentes(codEmpresa), toError),
      chain((agendamentos) => {
        if (agendamentos.length === 0) {
          console.log('Nenhum agendamento pendente encontrado.')
          return right(undefined)
        }
        return pipe(
          app.consumirDatasDeRealizacaoSoc(agendamentos),
          map((agendamentosAtualizados) => {
            console.log('Agendamentos atualizados', agendamentosAtualizados)
            console.log(`Agendamentos atualizados com sucesso: ${agendamentosAtualizados.filter((a) => a.errors.length === 0).length}`)
            console.log(`Agendamentos com erros: ${agendamentosAtualizados.filter((a) => a.errors.length > 0).length}`)
          }),
        )
      }),
      mapLeft((err) => {
        console.error(`Erro ao buscar lista de agendamentos pendentes: ${err.message}`)
      }),
    )()
  },
}
