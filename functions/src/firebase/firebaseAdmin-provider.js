"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Initialize Firebase admin
const log_1 = require("../log");
const secrets_provider_1 = require("../services/secrets-provider");
const admin = require('firebase-admin');
const serviceAccount = secrets_provider_1.default.Firebase();
log_1.logger.message('Firebase Admin Service Account: ' + serviceAccount.project_id);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://votery-1bfb6.firebaseio.com'
});
console.log('Firebase started version: ', admin.SDK_VERSION);
exports.default = admin;
//# sourceMappingURL=firebaseAdmin-provider.js.map