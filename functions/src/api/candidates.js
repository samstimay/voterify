"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateApi = void 0;
const log_1 = require("../log");
const firebase_api_1 = require("../firebase/firebase-api");
class CandidateApi {
    static createEndpoints(app) {
        app.get('/candidates', function (req, res) {
            log_1.logger.message('GET /candidates', log_1.logger.parseExpress(req, res));
            return CandidateApi.getCandidates(req, res);
        });
    }
    static getCandidates(req, res) {
        const electionId = req.query.id;
        try {
            return firebase_api_1.firebaseApi
                .firestore()
                .collection('candidates')
                .where('electionId', '==', electionId)
                .get()
                .then(function (data) {
                const candidates = [];
                data.docs.forEach(function (doc) {
                    candidates.push(doc.data());
                });
                return res.json(candidates);
            })
                .catch(function (err) {
                return log_1.Errors.onCatch(res, err);
            });
        }
        catch (error) {
            return log_1.Errors.onCrash(res, error);
        }
    }
    static addEditCandidate(candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield firebase_api_1.firebaseApi
                    .firestore()
                    .collection('candidates')
                    .where('id', '==', candidate.id)
                    .get()
                    .then(function (querySnapshot) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (querySnapshot.empty || querySnapshot.size === 0) {
                            yield firebase_api_1.firebaseApi
                                .firestore()
                                .collection('candidates')
                                .doc(candidate.id)
                                .set({
                                id: candidate.id,
                                name: candidate.name,
                                party: candidate.party,
                                electionId: candidate.electionId,
                                active: true
                            });
                        }
                        else {
                            querySnapshot.forEach(function (doc) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    yield firebase_api_1.firebaseApi
                                        .firestore()
                                        .collection('candidates')
                                        .doc(candidate.id)
                                        .update({
                                        name: candidate.name,
                                        party: candidate.party,
                                        active: candidate.active
                                    });
                                });
                            });
                        }
                    });
                });
            }
            catch (error) {
                return log_1.Errors.log(JSON.stringify(error));
            }
            return '';
        });
    }
}
exports.CandidateApi = CandidateApi;
//# sourceMappingURL=candidates.js.map