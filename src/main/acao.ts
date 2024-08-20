import { AgendamentoProcessados } from '@/domain/protocols/entities/agendamentos'
import { AppType } from '@/main/app'
import { isRight } from '@/utils/Either'

export const exeuctarAcao = async (app: AppType) => {
  console.log('Consumindo datas de realização de atendimentos pendentes...')

  await app.consumirDatasDeRealizacaoDosExames({ codEmpresa: 11 }).then((res) => {
    if (isRight(res)) {
      const processados: AgendamentoProcessados[] = res.right
      const comSucesso = processados.filter((ag) => ag.status === 1)
      const comErro = processados.filter((ag) => ag.status === 2)

      console.log(`Agendamentos processados com sucesso: ${comSucesso.length}`)
      // console.log(`Agendamentos processados com erros: ${comErro.length}`)

      // comErro.map((ag) => {
      //   ag.errors?.map((err) => console.log(err))
      // })
    }
  })
}
