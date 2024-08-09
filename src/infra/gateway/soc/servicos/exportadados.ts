import { CriarSoapClientType } from '../../soap'

type Deps = {
  criarSoapClient: CriarSoapClientType
  parametros: object
}

export const consumirExportaDados = async ({ criarSoapClient, parametros }: Deps) => {
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

  const resultadoED = await soapClient.executarSoap(wsdl, 'exportaDadosWs', xml)
  return JSON.parse(resultadoED.return.retorno)
}
