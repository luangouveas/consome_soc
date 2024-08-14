import { CriarSoapClientType } from '../../soap'
import { pipe, tryCatch, map, toError, mapLeft, left, right, chain } from '@/utils/Either'

type Deps = {
  criarSoapClient: CriarSoapClientType
  parametros: object
}

export const consumirExportaDados = ({ criarSoapClient, parametros }: Deps) => {
  const wsdl = process.env.WSDL_SOC_EXPORTADADOS as string
  const soapClient = criarSoapClient()

  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.soc.age.com/">
        <soapenv:Header/>
        <soapenv:Body>
        <ser:exportaDadosWs>
            <arg0>
                <parametros>${JSON.stringify(parametros)}</parametros>"
            </arg0>
        </ser:exportaDadosWs>
        </soapenv:Body>
    </soapenv:Envelope>`

  return pipe(
    tryCatch(() => soapClient.executarSoap(wsdl, 'exportaDadosWs', xml), toError),
    chain((res) => {
      if (res.return.erro) {
        return left(new Error(res.return.mensagemErro))
      }
      return right(JSON.parse(res.return.retorno))
    }),
  )
}
