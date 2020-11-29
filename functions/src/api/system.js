"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemApi = void 0;
const log_1 = require("../log");
const firebase_api_1 = require("../firebase/firebase-api");
class SystemApi {
    static createEndpoints(app) {
        app.get('/info', function (req, res) {
            log_1.logger.message('GET /info', log_1.logger.parseExpress(req, res));
            return SystemApi.getInfo(req, res);
        });
    }
    static getInfo(req, res) {
        try {
            return firebase_api_1.firebaseApi
                .firestore()
                .collection('System')
                .doc('votery')
                .get()
                .then((data) => {
                const result = {
                    version: data.get('version')
                };
                if (res)
                    return res.json(result);
                return result;
            });
        }
        catch (error) {
            return log_1.Errors.onCrash(res, error);
        }
    }
}
exports.SystemApi = SystemApi;
//# sourceMappingURL=system.js.map