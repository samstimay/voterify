"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsApi = void 0;
const log_1 = require("../log");
const firebase_api_1 = require("../firebase/firebase-api");
const auth_api_1 = require("./auth-api");
const permissions_1 = require("../models/permissions");
class PermissionsApi {
    static createEndpoints(app) {
        app.get('/permission', function (req, res) {
            log_1.logger.message('GET /permission', log_1.logger.parseExpress(req, res));
            return auth_api_1.authApi
                .firebaseTokenAuth(req)
                .then((uid) => {
                if (uid)
                    return PermissionsApi.getPermissionsResponse(req, res, uid);
                else
                    return log_1.Errors.authFailed(req, res);
            })
                .catch((msg) => {
                return log_1.Errors.onCatch(res, msg);
            });
        });
    }
    static getPermissions(uid) {
        return firebase_api_1.firebaseApi
            .firestore()
            .collection('permissions')
            .doc(uid)
            .get()
            .then((data) => {
            if (data.exists) {
                return new permissions_1.default(data.get('type'));
            }
            else {
                return new permissions_1.default('');
            }
        })
            .catch(function (err) {
            throw err;
        });
    }
    static getPermissionsResponse(req, res, uid) {
        try {
            return this.getPermissions(uid)
                .then((permissions) => {
                return res.json(permissions);
            })
                .catch(function (err) {
                throw err;
            });
        }
        catch (error) {
            return log_1.Errors.onCrash(res, error);
        }
    }
}
exports.PermissionsApi = PermissionsApi;
//# sourceMappingURL=permissions.js.map