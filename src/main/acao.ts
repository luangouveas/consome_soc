import { AppType } from '@/main/app'
import * as E from 'fp-ts/Either'

export const exeuctarAcao = async (app: AppType) => {
  console.log('Consumindo datas de realização de atendimentos pendentes...')

  await app.consumirDatasDeRealizacaoDosExames({ codEmpresa: 11 }).then((res) => {
    if (E.isRight(res)) {
      console.log(`Agendamentos processados com sucesso: ${res.right.length}`)
    }
  })
}
