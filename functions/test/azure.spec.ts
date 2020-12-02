import * as chai from 'chai'
import * as sinon from 'sinon'
const expect = chai.expect
import { AzureSecrets, SecretsProvider } from '../src/services/secrets-provider'
import BlockchainApi from '../src/blockchain/index'
const secrets: AzureSecrets = SecretsProvider.Azure()

describe('Azure Blockchain', () => {
    it('should have azure secrets', () => {
        expect(secrets).to.not.be.null
        expect(secrets.client_api_id).to.not.be.null
        expect(secrets.client_api_id).to.have.lengthOf.above(0)
        expect(secrets.resource).to.not.be.null
        expect(secrets.resource).to.have.lengthOf.above(0)
    })

    it('should get an azure blockchain token', () => {
        const api = new BlockchainApi(secrets)
        api.acquireTokenWithClientCredentials().then(token => {
            expect(token).to.not.be.null
            expect(token.accessToken).to.not.be.null
            expect(token.accessToken).to.have.lengthOf.above(0)
        })
    })

    it('should create a block in azure blockchain', () => {
        const api = new BlockchainApi(secrets)
        const message = 'UNIT-TEST-MESSAGE ' + String(Date.now())
        api.send(message).then(token => {
            expect(token).to.not.be.null
            expect(token.accessToken).to.not.be.null
            expect(token.accessToken).to.have.lengthOf.above(0)
        })
    })
})
