import { Repositories } from './protocols'
import { ConsumirDatasDeRealizacaoDosExames } from '@/domain/usecases/commands/consumo-soc'

export const App = (repositories: Repositories) => {
  const commands = {
    consumirDatasDeRealizacaoDosExames: ConsumirDatasDeRealizacaoDosExames({ repository: repositories.agendamentosRepository }),
  }

  return { ...commands }
}
