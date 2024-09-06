import { app } from './app'
import { AtualizarDataRealizacaoJob } from '../domain/jobs/atualizar-data-realizacao'
import { Job } from '../domain/jobs/protocols'

const jobs: Job[] = [AtualizarDataRealizacaoJob]

const init = () => {
  jobs.forEach(async (job) => {
    if (job.active) await job.handle(app)
  })
}

init()
