import { Knex } from 'knex'
import { right, pipe, tryCatch, map, toError } from '@/utils/Either'
import { AsoExame, AsoExameRepository } from './protocols'

interface Deps {
  db: Knex
}

export const cirarAsoExameRepository = ({ db }: Deps) => {
  const dbAsoExame = () => db('ASOExame')
  return {
    async buscarASOExame(codAgendamentoCredenciadoServico: number) {
      const asoExame: AsoExame = await dbAsoExame().select('*').where({ codAgendamentoCredenciadoServico: codAgendamentoCredenciadoServico }).first()
      console.log('asoexame: ', asoExame)
      return asoExame
    },
    async inserirAsoExame(ASOExame: AsoExame) {
      await dbAsoExame().insert(ASOExame)
      return ASOExame
    },
    async atualizarAsoExame(ASOExame: AsoExame) {
      console.log(ASOExame)
      const qtd = await dbAsoExame().where({ codASO: ASOExame.codASO }).update(ASOExame)
      return qtd
    },
  }
}
