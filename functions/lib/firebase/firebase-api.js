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
const firebaseAdmin_provider_1 = require("./firebaseAdmin-provider");
class FirebaseApi {
    authToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield firebaseAdmin_provider_1.default.auth().signInWithCustomToken(token);
        });
    }
    firestore() {
        return firebaseAdmin_provider_1.default.firestore();
    }
    database() {
        return firebaseAdmin_provider_1.default.database();
    }
}
const firebaseApi = new FirebaseApi();
exports.firebaseApi = firebaseApi;
//# sourceMappingURL=firebase-api.js.map