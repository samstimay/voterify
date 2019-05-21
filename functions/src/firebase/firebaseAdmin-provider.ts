// Initialize Firebase admin
import { logger } from "../log";
const admin = require("firebase-admin");
const serviceAccount = require("../../secrets/voterify-7637e-firebase-adminsdk-nal41-d99d35a65e.json");

logger.message("Firebase Admin Service Account: " + serviceAccount.project_id);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://voterify-7637e.firebaseio.com"
});

console.log("Firebase started version: ", admin.SDK_VERSION);

export default admin;
