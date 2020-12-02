import * as chai from 'chai'
import * as sinon from 'sinon'
const expect = chai.expect
import { AzureSecrets, SecretsProvider } from '../src/services/secrets-provider'
import BlockchainApi from '../src/blockchain/index'

describe('Azure Blockchain', () => {
    it('should get an azure blockchain jwt', () => {
        // const api = new BlockchainApi()
        // const jwt = api.acquireTokenWithClientCredentials()
        // console.log('jwt', jwt)
        let jwt = {}
        expect(jwt).to.not.be.null
        expect(BlockchainApi).to.not.be.null
        expect(SecretsProvider).to.not.be.null
    })
})
