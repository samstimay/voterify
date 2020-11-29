const Swagger = require('swagger-client')
const AuthenticationContext = require('adal-node').AuthenticationContext
import SecretsProvider from '../services/secrets-provider'
const secrets = SecretsProvider.Azure()
import { logger } from '../log'

export default class BlockchainApi {
    private workbench_api_url = secrets.workbench_api_url
    private clientAppId = secrets.client_api_id
    private clientSecret = secrets.client_secret
    private authorityHostUrl = secrets.authority
    private tenant = secrets.tenant
    private resource = secrets.resource

    // Getting token from AAD
    public acquireTokenWithClientCredentials = async (): Promise<any> => {
        var authorityUrl = `${this.authorityHostUrl}${this.tenant}`

        var context = new AuthenticationContext(authorityUrl)

        return new Promise((resolve, reject) => {
            context.acquireTokenWithClientCredentials(
                this.resource,
                this.clientAppId,
                this.clientSecret,
                function (err: any, tokenResponse: any) {
                    if (err) {
                        return reject(err)
                    } else {
                        logger.debug('Blockchain api token created')
                        return resolve(tokenResponse)
                    }
                }
            )
        })
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
                    Authorization: `Bearer ${token.accessToken}`
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
