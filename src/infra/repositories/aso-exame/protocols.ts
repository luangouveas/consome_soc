import { TaskEither, pipe } from '@/utils/Either'

export type AsoExame = {
  codASO?: number
  datCriacao: string
  codUsuarioCriacao: number
}

export interface AsoExameRepository {
  buscarASOExame: (codAgendamentoCredenciadoServico: number) => Promise<AsoExame>
  inserirAsoExame: (ASOExame: AsoExame) => Promise<AsoExame>
  atualizarAsoExame: (ASOExame: AsoExame) => Promise<number>
}
