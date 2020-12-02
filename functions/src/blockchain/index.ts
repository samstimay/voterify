const Swagger = require('swagger-client')
const AuthenticationContext = require('adal-node').AuthenticationContext
import { AzureSecrets, SecretsProvider } from '../services/secrets-provider'
import { logger } from '../log'

export default class BlockchainApi {
    private secrets: AzureSecrets

    public constructor(secrets: AzureSecrets | null = null) {
        if (secrets === null) this.secrets = SecretsProvider.Azure()
        else this.secrets = secrets
    }

    private getHeader(token: any): Object {
        return {
            'Content-Type': 'application/json;charset=UTF-8',
            Authorization: `Bearer ${token.accessToken}`
        }
    }

    // Getting token from AAD
    public acquireTokenWithClientCredentials = async (): Promise<any> => {
        var authorityUrl = `${this.secrets.authority}${this.secrets.tenant}`

        var context = new AuthenticationContext(authorityUrl)

        return new Promise((resolve, reject) => {
            context.acquireTokenWithClientCredentials(
                this.secrets.resource,
                this.secrets.client_api_id,
                this.secrets.client_secret,
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
                url:
                    `${this.secrets.workbench_api_url}api/v2/contracts?` +
                    `workflowId=${this.secrets.workbench_workflow_id}&` +
                    `contractCodeId=${this.secrets.workbench_contract_code_id}&` +
                    `connectionId=${this.secrets.workbench_connection_id}`,
                method: 'POST',
                headers: this.getHeader(token),
                body: {
                    workflowFunctionId: 1,
                    workflowActionParameters: [
                        { name: 'message', value: message }
                    ]
                }
            }

            return await Swagger.http(request)
        } catch (err) {
            return err
        }
    }
}
