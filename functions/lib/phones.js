"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("./log");
const firebase_api_1 = require("./firebase/firebase-api");
const auth_api_1 = require("./auth-api");
class PhoneApi {
    static createEndpoints(app) {
        app.get("/phone", function (req, res) {
            log_1.logger.message("GET /phone", log_1.logger.parseExpress(req, res));
            return auth_api_1.authApi
                .firebaseTokenAuth(req)
                .then(isAuth => {
                if (isAuth)
                    return PhoneApi.getPhone(req, res);
                else
                    return log_1.Errors.authFailed(req, res);
            })
                .catch((msg) => {
                return log_1.Errors.onCatch(res, msg);
            });
        });
        app.post("/phone", function (req, res) {
            log_1.logger.message("POST /phone", log_1.logger.parseExpress(req, res));
            log_1.logger.debug("POST /phone", req, res);
            return log_1.Errors.notImplemented(res);
        });
    }
    static getPhone(req, res) {
        try {
            let phone = req.query.id;
            if (phone.indexOf("+") >= 0)
                phone = phone.replace("+", "");
            return firebase_api_1.firebaseApi
                .firestore()
                .collection("voters")
                .doc(phone)
                .get()
                .then((data) => {
                var result = {
                    exists: data.exists,
                    phone: data.get("phone"),
                    uid: data.get("uid")
                };
                return res.json(result);
            })
                .catch((err) => {
                return log_1.Errors.onCatch(res, err);
            });
        }
        catch (error) {
            return log_1.Errors.onCrash(res, error);
        }
    }
}
exports.PhoneApi = PhoneApi;
//# sourceMappingURL=phones.js.map