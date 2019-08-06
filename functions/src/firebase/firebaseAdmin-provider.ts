// Initialize Firebase admin
import { logger } from "../log";
const admin = require("firebase-admin");
const serviceAccount = require("../../secrets/firebase-secrets.json");

logger.message("Firebase Admin Service Account: " + serviceAccount.project_id);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://votery-1bfb6.firebaseio.com"
});

console.log("Firebase started version: ", admin.SDK_VERSION);

export default admin;
