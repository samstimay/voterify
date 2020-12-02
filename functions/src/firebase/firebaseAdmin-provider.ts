// Initialize Firebase admin
import { logger } from '../log'
import { SecretsProvider } from '../services/secrets-provider'

const admin = require('firebase-admin')
const serviceAccount = SecretsProvider.Firebase()

logger.message('Firebase Admin Service Account: ' + serviceAccount.project_id)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://votery-1bfb6.firebaseio.com'
})

console.log('Firebase started version: ', admin.SDK_VERSION)

export default admin
