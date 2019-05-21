"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../log");
const firebase_api_1 = require("../firebase/firebase-api");
class ElectionApi {
    static createEndpoints(app) {
        app.get("/elections", function (req, res) {
            log_1.logger.message("GET /elections", log_1.logger.parseExpress(req, res));
            return ElectionApi.getElections(req, res);
        });
    }
    static getElections(req, res) {
        try {
            return firebase_api_1.firebaseApi
                .firestore()
                .collection("elections")
                .get()
                .then(function (data) {
                const elections = [];
                data.docs.forEach(function (doc) {
                    elections.push(doc.data());
                });
                return res.json(elections);
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
exports.ElectionApi = ElectionApi;
//# sourceMappingURL=elections.js.map