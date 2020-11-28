const axios = require('axios')
const Swagger = require('swagger-client')
import SecretsProvider from '../src/services/secrets-provider'
const secrets = SecretsProvider.Azure()

export default class BlockchainApi {
    private AUTHORITY = secrets.authority
    private WORKBENCH_API_URL = secrets.workbench_api_url
    private RESOURCE = secrets.resource
    private CLIENT_APP_Id = secrets.client_api_id
    private CLIENT_SECRET = secrets.client_secret

    // Getting token from AAD
    public acquireTokenWithClientCredentials = async () => {
        const requestBody = {
            resource: this.RESOURCE,
            client_id: this.CLIENT_APP_Id,
            client_secret: this.CLIENT_SECRET,
            grant_type: 'client_credentials'
        }
        const response = await axios({
            method: 'POST',
            url: `${this.AUTHORITY}/oauth2/token`,
            data: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })

        return response.data
    }

    public send = async (message: string) => {
        try {
            const token = await this.acquireTokenWithClientCredentials()

            const request = {
                url: `${this.WORKBENCH_API_URL}/api/v2/contracts?workflowId=1&contractCodeId=1&connectionId=1`,
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
