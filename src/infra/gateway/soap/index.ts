import * as soap from 'soap'

export type CriarSoapClientType = () => {
  executarSoap: (wsdl: string, method: string, xml: string) => Promise<any>
}

export const criarSoapClient: CriarSoapClientType = () => {
  return {
    async executarSoap(wsdl, method, xml) {
      const client = await soap.createClientAsync(wsdl)
      const methodAsync = method + 'Async'
      const args = {
        _xml: xml,
      }
      const [res] = await client[methodAsync](args)
      return res
    },
  }
}
