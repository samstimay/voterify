"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../log");
const firebase_api_1 = require("../firebase/firebase-api");
class CandidateApi {
    static createEndpoints(app) {
        app.get("/candidates", function (req, res) {
            log_1.logger.message("GET /candidates", log_1.logger.parseExpress(req, res));
            return CandidateApi.getCandidates(req, res);
        });
    }
    static getCandidates(req, res) {
        const electionId = req.query.id;
        try {
            return firebase_api_1.firebaseApi
                .firestore()
                .collection("candidates")
                .where("electionId", "==", electionId)
                .get()
                .then(function (data) {
                const candidates = [];
                data.docs.forEach(function (doc) {
                    candidates.push(doc.data());
                });
                return res.json(candidates);
            })
                .catch(function (err) {
                return log_1.Errors.onCatch(res, err);
            });
        }
        catch (error) {
            return log_1.Errors.onCrash(res, error);
        }
    }
}
exports.CandidateApi = CandidateApi;
//# sourceMappingURL=candidates.js.map