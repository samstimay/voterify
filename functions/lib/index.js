"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const log_1 = require("./log");
const elections_1 = require("./api/elections");
const candidates_1 = require("./api/candidates");
const phones_1 = require("./api/phones");
const votes_1 = require("./api/votes");
const voters_1 = require("./api/voters");
const firebaseAdmin_provider_1 = require("./firebase/firebaseAdmin-provider");
const queue_1 = require("./firebase/queue");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
// Basic Express Setup with middleware
const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: "No credentials sent!" });
    }
    next();
});
app.get("/", function (req, res) {
    return res.json({ hi: "there" });
});
log_1.logger.debug("API loading...");
// Setup Endpoints
phones_1.PhoneApi.createEndpoints(app);
candidates_1.CandidateApi.createEndpoints(app);
elections_1.ElectionApi.createEndpoints(app);
votes_1.VoteApi.createEndpoints(app);
voters_1.VoterApi.createEndpoints(app);
firebaseAdmin_provider_1.default.auth();
const queue = new queue_1.default();
queue.start(firebaseAdmin_provider_1.default);
// Export App for use with Firebase Functions
exports.voterifyApi = functions.https.onRequest(app);
log_1.logger.debug("API loaded");
//# sourceMappingURL=index.js.map