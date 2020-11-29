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
exports.ElectionApi = void 0;
const log_1 = require("../log");
const firebase_api_1 = require("../firebase/firebase-api");
const permissions_1 = require("./permissions");
const auth_api_1 = require("./auth-api");
const election_1 = require("../models/election");
const candidates_1 = require("./candidates");
class ElectionApi {
    static createEndpoints(app) {
        app.get('/elections', function (req, res) {
            log_1.logger.message('GET /elections', log_1.logger.parseExpress(req, res));
            return ElectionApi.getElections(req, res);
        });
        app.get('/elections/edit', function (req, res) {
            log_1.logger.message('GET /elections/edit', log_1.logger.parseExpress(req, res));
            return auth_api_1.authApi
                .firebaseTokenAuth(req)
                .then((uid) => __awaiter(this, void 0, void 0, function* () {
                if (uid) {
                    const permission = yield permissions_1.PermissionsApi.getPermissions(uid);
                    return ElectionApi.getEditElections(req, res, uid, permission);
                }
                else
                    return log_1.Errors.authFailed(req, res);
            }))
                .catch((msg) => {
                return log_1.Errors.onCatch(res, msg);
            });
        });
        app.post('/elections/edit', function (req, res) {
            log_1.logger.message('POST /elections/edit', log_1.logger.parseExpress(req, res));
            return auth_api_1.authApi
                .firebaseTokenAuth(req)
                .then((uid) => __awaiter(this, void 0, void 0, function* () {
                if (uid) {
                    const permission = yield permissions_1.PermissionsApi.getPermissions(uid);
                    return ElectionApi.editElection(req, res, uid, permission);
                }
                else
                    return log_1.Errors.authFailed(req, res);
            }))
                .catch((msg) => {
                return log_1.Errors.onCatch(res, msg);
            });
        });
    }
    static getElections(req, res) {
        try {
            return firebase_api_1.firebaseApi
                .firestore()
                .collection('elections')
                .get()
                .then(function (data) {
                const elections = [];
                data.docs.forEach(function (doc) {
                    elections.push(doc.data());
                });
                return res.json(elections);
            })
                .catch(function (err) {
                return log_1.Errors.onCatch(res, err);
            });
        }
        catch (error) {
            return log_1.Errors.onCrash(res, error);
        }
    }
    static getEditElections(req, res, uid, permissions) {
        if (!permissions.isAdmin())
            return res.json([]);
        try {
            return firebase_api_1.firebaseApi
                .firestore()
                .collection('elections')
                .where('admin', '==', uid)
                .get()
                .then(function (data) {
                const elections = [];
                data.docs.forEach(function (doc) {
                    elections.push(doc.data());
                });
                return res.json(elections);
            })
                .catch(function (err) {
                return log_1.Errors.onCatch(res, err);
            });
        }
        catch (error) {
            return log_1.Errors.onCrash(res, error);
        }
    }
    static editElection(req, res, uid, permissions) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = [];
            if (!permissions.isAdmin())
                return res.json([]);
            const election = new election_1.default(req.body.name, req.body.id, req.body.region, req.body.date, req.body.candidates || [], req.body.active);
            if (!election.id)
                errors.push('No election ID');
            try {
                if (errors.length === 0) {
                    yield firebase_api_1.firebaseApi
                        .firestore()
                        .collection('elections')
                        .where('id', '==', election.id)
                        .get()
                        .then(function (querySnapshot) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (querySnapshot.empty || querySnapshot.size === 0) {
                                yield firebase_api_1.firebaseApi
                                    .firestore()
                                    .collection('elections')
                                    .doc(election.id)
                                    .set({
                                    id: election.id,
                                    name: election.name,
                                    region: election.region,
                                    date: new Date(),
                                    admin: uid,
                                    active: true
                                });
                            }
                            else {
                                querySnapshot.forEach(function (doc) {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        if (doc.get('admin') === uid) {
                                            yield firebase_api_1.firebaseApi
                                                .firestore()
                                                .collection('elections')
                                                .doc(doc.id)
                                                .update({
                                                name: election.name,
                                                region: election.region,
                                                active: election.active
                                            });
                                        }
                                        else {
                                            errors.push('You are not the admin of this election.');
                                        }
                                    });
                                });
                            }
                        });
                    });
                    election.candidates.forEach((candidate) => __awaiter(this, void 0, void 0, function* () {
                        if (errors.length)
                            return;
                        const err = yield candidates_1.CandidateApi.addEditCandidate(candidate);
                        if (err.length) {
                            errors.push(err);
                        }
                    }));
                }
                if (errors.length)
                    return res.json({ errors });
                else
                    return res.json(election);
            }
            catch (error) {
                return log_1.Errors.onCrash(res, error);
            }
        });
    }
}
exports.ElectionApi = ElectionApi;
//# sourceMappingURL=elections.js.map