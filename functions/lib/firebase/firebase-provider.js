"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
const env_1 = require("../env");
// Initialize Firebase admin
var admin = require("firebase-admin");
var serviceAccount = require("../../secrets/voterify-7637e-firebase-adminsdk-nal41-d99d35a65e.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://voterify-7637e.firebaseio.com"
});
// Initialize Firebase
firebase.initializeApp(env_1.Env.firebaseConfig());
firebase.auth().useDeviceLanguage();
console.log("firebase started version: ", firebase.SDK_VERSION);
exports.default = firebase;
//# sourceMappingURL=firebase-provider.js.map