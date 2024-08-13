import { CriarSoapClientType } from '../../soap'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'

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
    TE.tryCatch(() => soapClient.executarSoap(wsdl, 'exportaDadosWs', xml), E.toError),
    TE.map((res) => {
      //console.log(JSON.parse(res.return.retorno))
      return JSON.parse(res.return.retorno)
    }),
  )
}
