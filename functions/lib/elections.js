"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("./log");
const firebase_api_1 = require("./firebase/firebase-api");
class ElectionApi {
    static createEndpoints(app) {
        app.get("/elections", function (req, res) {
            log_1.logger.message("GET /elections", log_1.logger.parseExpress(req, res));
            return ElectionApi.getElections(req, res);
        });
    }
    static getElections(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield firebase_api_1.firebaseApi
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
        });
    }
}
exports.ElectionApi = ElectionApi;
//# sourceMappingURL=elections.js.map