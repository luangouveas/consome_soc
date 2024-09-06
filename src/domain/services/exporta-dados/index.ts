import { criarSoapClient } from '@/infra/gateway/soap'
import { consumirExportaDados } from '@/infra/gateway/soc/servicos/exportadados'

export const consumirExportaDadosSoc = (parametros: object) => {
  const result = consumirExportaDados({ criarSoapClient, parametros })
  return result
}
