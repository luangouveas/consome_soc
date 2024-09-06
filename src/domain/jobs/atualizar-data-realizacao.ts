import { Job } from './protocols'
import { AgendamentoPendente } from '@/infra/repositories/protocols'
import { AppType } from '../../main/app'
import { tryCatch, chain, pipe, map, mapLeft, toError, sequenceArray, right, traverseArray } from '@/utils/Either'

export const AtualizarDataRealizacaoJob: Job = {
  name: 'AtualizarDataRealizacaoJob',
  frequence: '',
  active: true,
  handle: (app: AppType) => {
    const codEmpresa = 11

    return pipe(
      tryCatch(() => app.buscarAgendamentosPendentes(codEmpresa), toError),
      chain((agendamentos: AgendamentoPendente[]) => app.consumirDatasDeRealizacaoSoc(agendamentos)),
      map((examesAtualizados) => console.log(`Exames atualizados: ${examesAtualizados.length}`)),
      mapLeft((err) => console.log(err.message)),
    )()
  },
}
