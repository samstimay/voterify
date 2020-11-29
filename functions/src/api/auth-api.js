"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authApi = void 0;
const log_1 = require("../log");
const admin = require("firebase-admin");
class AuthApi {
    getToken(req) {
        let token = new String(req.query.token || req.headers.authorization);
        if (token.indexOf('Bearer ') >= 0) {
            token = token.replace('Bearer ', '');
        }
        return token.toString();
    }
    // return the firebase uid based upon the request
    firebaseTokenAuth(req) {
        const token = this.getToken(req);
        return admin
            .auth()
            .verifyIdToken(token)
            .then(function (data) {
            if (data.uid && data.uid.length)
                return data.uid;
            return '';
        })
            .catch(function (msg) {
            log_1.logger.error('auth failed', msg);
            return '';
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