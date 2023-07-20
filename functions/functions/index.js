/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getFirestore } = require("firebase-admin/firestore");
admin.initializeApp();

logger.debug('Votery Functions loading...')

exports.getInfo = functions.https.onCall((req, res) => {
    try {
        return getFirestore()
            .collection('System')
            .doc('votery')
            .get()
            .then((data) => {
                const result = {
                    version: data.get('version')
                }
                if (res) return res.json(result)
                return result
            })
    } catch (error) {
        return logger.error(res, error)
    }
});

logger.debug('Votery Functions loaded')
