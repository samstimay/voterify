import { logger } from "../log";
import * as admin from "firebase-admin";
class AuthApi {
    getToken(req) {
        let token = req.query.token || req.headers.authorization;
        if (token.indexOf("Bearer ") >= 0) {
            token = token.replace("Bearer ", "");
        }
        return token;
    }
    firebaseTokenAuth(req) {
        const token = this.getToken(req);
        return admin
            .auth()
            .verifyIdToken(token)
            .then(function (data) {
            if (data.uid && data.uid.length)
                return data.uid;
            return null;
        })
            .catch(function (msg) {
            logger.error("auth failed", msg);
            return null;
        });
    }
    getAuth() {
        return admin.auth();
    }
    getUser(uid) {
        return this.getAuth().getUser(uid);
    }
}
const authApi = new AuthApi();
export { authApi };
//# sourceMappingURL=auth-api.js.map