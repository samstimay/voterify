"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../log");
const admin = require("firebase-admin");
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
            log_1.logger.error("auth failed", msg);
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
exports.authApi = authApi;
//# sourceMappingURL=auth-api.js.map