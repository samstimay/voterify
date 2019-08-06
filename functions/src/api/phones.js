import { logger, Errors } from "../log";
import { firebaseApi } from "../firebase/firebase-api";
import { authApi } from "./auth-api";
class PhoneApi {
    static createEndpoints(app) {
        app.get("/phone", function (req, res) {
            logger.message("GET /phone", logger.parseExpress(req, res));
            return authApi
                .firebaseTokenAuth(req)
                .then(uid => {
                if (uid)
                    return PhoneApi.getPhone(req, res);
                else
                    return Errors.authFailed(req, res);
            })
                .catch((msg) => {
                return Errors.onCatch(res, msg);
            });
        });
        app.post("/phone", function (req, res) {
            logger.message("POST /phone", logger.parseExpress(req, res));
            logger.debug("POST /phone", req, res);
            return Errors.notImplemented(res);
        });
    }
    static getPhone(req, res) {
        try {
            let phone = req.query.id;
            if (phone.indexOf("+") >= 0)
                phone = phone.replace("+", "");
            return firebaseApi
                .firestore()
                .collection("voters")
                .doc(phone)
                .get()
                .then((data) => {
                const result = {
                    exists: data.exists,
                    phone: data.get("phone"),
                    uid: data.get("uid")
                };
                return res.json(result);
            })
                .catch((err) => {
                return Errors.onCatch(res, err);
            });
        }
        catch (error) {
            return Errors.onCrash(res, error);
        }
    }
}
export { PhoneApi };
//# sourceMappingURL=phones.js.map