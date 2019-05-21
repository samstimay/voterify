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
class AuthApi {
    getToken(req) {
        let token = req.query.token || req.headers.authorization;
        if (token.indexOf("Bearer ") >= 0) {
            token = token.replace("Bearer ", "");
        }
        return token;
    }
    firebaseTokenAuth(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = this.getToken(req);
            console.log("GET /phone token", token);
            return yield firebase_api_1.firebaseApi
                .authToken(token)
                .then(function (data) {
                log_1.logger.message("GET /phone auth response " + JSON.stringify(data));
                return true;
            })
                .catch(function (msg) {
                log_1.logger.error("GET /phone auth failed", msg);
                return false;
            });
        });
    }
}
const authApi = new AuthApi();
exports.authApi = authApi;
//# sourceMappingURL=auth.js.map