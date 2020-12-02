const Swagger = require('swagger-client')
const AuthenticationContext = require('adal-node').AuthenticationContext
import { AzureSecrets, SecretsProvider } from '../services/secrets-provider'
import { logger } from '../log'

export default class BlockchainApi {
    private workbench_api_url: String
    private clientAppId: String
    private clientSecret: String
    private authorityHostUrl: String
    private tenant: String
    private resource: String

    public constructor(secrets: AzureSecrets | null = null) {
        if (secrets === null) secrets = SecretsProvider.Azure()
        this.workbench_api_url = secrets?.workbench_api_url as String
        this.clientAppId = secrets?.client_api_id as String
        this.clientSecret = secrets?.client_secret as String
        this.authorityHostUrl = secrets?.authority as String
        this.tenant = secrets?.tenant as String
        this.resource = secrets?.resource as String
    }

    // Getting token from AAD
    public acquireTokenWithClientCredentials = async (): Promise<any> => {
        var authorityUrl = `${this.authorityHostUrl}${this.tenant}`

        var context = new AuthenticationContext(authorityUrl)

        return new Promise((resolve, reject) => {
            context.acquireTokenWithClientCredentials(
                this.resource,
                this.clientAppId,
                this.clientSecret,
                function(err: any, tokenResponse: any) {
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
