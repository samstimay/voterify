const Swagger = require('swagger-client')
const AuthenticationContext = require('adal-node').AuthenticationContext
import SecretsProvider from '../services/secrets-provider'
const secrets = SecretsProvider.Azure()

export default class BlockchainApi {
    private workbench_api_url = secrets.workbench_api_url
    private clientAppId = secrets.client_api_id
    private clientSecret = secrets.client_secret
    private authorityHostUrl = secrets.authority
    private tenant = secrets.tenant
    private resource = secrets.resource

    // Getting token from AAD
    public acquireTokenWithClientCredentials = async () => {
        var authorityUrl = `${this.authorityHostUrl}${this.tenant}`

        console.log('BlockchainApi authorityUrl', authorityUrl)
        var context = new AuthenticationContext(authorityUrl)

        return context.acquireTokenWithClientCredentials(
            this.resource,
            this.clientAppId,
            this.clientSecret,
            function (err: any, tokenResponse: any) {
                if (err) {
                    console.log("well that didn't work: " + err.stack)
                } else {
                    console.log('AZURE BLOCKCHAIN API TOKEN', tokenResponse)
                    return tokenResponse
                }
            }
        )
    }

    public send = async (message: string) => {
        try {
            const token = await this.acquireTokenWithClientCredentials()

            const request = {
                url: `${this.workbench_api_url}/api/v2/contracts?workflowId=1&contractCodeId=1&connectionId=1`,
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json;charset=utf-8;odata=verbose',
                    Authorization: `Bearer ${token.access_token}`
                },
                body: {
                    workflowActionInput: {
                        workflowFunctionID: 1,
                        workflowActionParameters: [
                            {
                                name: 'RequestMessage',
                                value: message,
                                workflowFunctionParameterId: 2
                            }
                        ]
                    }
                }
            }

            return await Swagger.http(request)
        } catch (err) {
            console.error(err)
        }
    }
}
