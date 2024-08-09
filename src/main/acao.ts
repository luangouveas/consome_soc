import { AppType } from '@/main/app'

export const exeuctarAcao = async (app: AppType) => {
  console.log('Consumindo datas de realização de atendimentos pendentes...')

  const res = await app.consumirDatasDeRealizacaoDosExames({ codEmpresa: 11 })
  if (res.length > 0) {
    const ok = res.filter((item) => item.status === 1)
    const err = res.filter((item) => item.status === 2)

    console.log(`Agendamentos processados com sucesso: ${ok.length}`)
    console.log(`Agendamentos processados com erros: ${err.length}`)
  } else {
    console.error('Erro ao tentar processar agendamentos')
  }
}
