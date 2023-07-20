// Initialize Firebase admin
import { logger } from '../log'
const settings = require('../../settings.json')
const { initializeApp } = require('firebase-admin/app');
const serviceAccount = require('../../secrets/' + settings.secrets.file)

logger.message('Firebase Admin Service Account: ' + serviceAccount.project_id)

const admin = initializeApp()

console.log('Firebase started version: ', admin.SDK_VERSION)

export default admin
