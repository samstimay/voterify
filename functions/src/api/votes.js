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
exports.VoteApi = void 0;
const log_1 = require("../log");
const firebase_api_1 = require("../firebase/firebase-api");
const auth_api_1 = require("./auth-api");
const voters_1 = require("./voters");
// import { BlockInfo } from "../blockchain/blockService"
const cors = require('cors');
class VoteApi {
    static voteId(voterId, electionId) {
        return electionId + '-' + voterId;
    }
    static createEndpoints(app) {
        app.get('/checkVote', function (req, res) {
            log_1.logger.message('GET /checkVote', log_1.logger.parseExpress(req, res));
            return VoteApi.checkVote(req, res);
        });
        app.get('/getVotes', function (req, res) {
            log_1.logger.message('GET /getVotes', log_1.logger.parseExpress(req, res));
            return VoteApi.getVotes(req, res);
        });
        app.get('/getVotesTable', cors(), function (req, res) {
            log_1.logger.message('GET /getVotesTable', log_1.logger.parseExpress(req, res));
            return VoteApi.getVotesTable(req, res);
        });
        app.get('/tallyVotes', function (req, res) {
            log_1.logger.message('GET /tallyVotes', log_1.logger.parseExpress(req, res));
            return VoteApi.tallyVotes(req, res);
        });
        app.post('/trackVote', function (req, res) {
            log_1.logger.message('POST /trackVote', log_1.logger.parseExpress(req, res));
            return VoteApi.trackVote(req, res);
        });
        app.post('/trackUID', function (req, res) {
            log_1.logger.message('POST /trackUID', log_1.logger.parseExpress(req, res));
            return VoteApi.trackUID(req, res);
        });
        app.post('/createVote', function (req, res) {
            log_1.logger.message('POST /createVote', log_1.logger.parseExpress(req, res));
            return auth_api_1.authApi
                .firebaseTokenAuth(req)
                .then((uid) => {
                if (uid)
                    return VoteApi.createVote(req, res, uid);
                else
                    return log_1.Errors.authFailed(req, res);
            })
                .catch((msg) => {
                return log_1.Errors.onCatch(res, msg);
            });
        });
    }
    static checkVote(req, res) {
        const voterId = req.query.voterId.toString(), electionId = req.query.id.toString(), voteId = VoteApi.voteId(voterId, electionId);
        try {
            return firebase_api_1.firebaseApi
                .firestore()
                .collection('votes')
                .doc(voteId)
                .get()
                .then((data) => {
                const result = {
                    exists: data.exists
                };
                return res.json(result);
            })
                .catch(function (err) {
                return log_1.Errors.onCatch(res, err);
            });
        }
        catch (error) {
            return log_1.Errors.onCrash(res, error);
        }
    }
    static getVotes(req, res) {
        const electionId = req.query.id;
        try {
            return firebase_api_1.firebaseApi
                .firestore()
                .collection('votes')
                .where('electionId', '==', electionId)
                .get()
                .then((data) => {
                const result = [];
                data.docs.forEach(function (value) {
                    result.push({
                        voterId: value.get('voterId'),
                        candidateId: value.get('candidateId'),
                        candidate: value.get('candidate'),
                        date: value.get('date')
                    });
                });
                return res.json(result);
            })
                .catch(function (err) {
                return log_1.Errors.onCatch(res, err);
            });
        }
        catch (error) {
            return log_1.Errors.onCrash(res, error);
        }
    }
    static getVotesTable(req, res) {
        const electionId = req.query.id, page = Number(req.query.page), perPage = Number(req.query.per_page), startAt = 1 + (page - 1) * perPage;
        let sort = req.query.sort;
        if (sort !== 'electionId')
            sort = 'date';
        try {
            return firebase_api_1.firebaseApi
                .firestore()
                .collection('votes')
                .where('electionId', '==', electionId)
                .orderBy(sort)
                .startAt(startAt)
                .limit(perPage)
                .get()
                .then((data) => {
                const result = [];
                data.docs.forEach(function (value) {
                    result.push({
                        voterId: value.get('voterId'),
                        candidateId: value.get('candidateId'),
                        candidate: value.get('candidate'),
                        date: value.get('date')
                    });
                });
                const response = {
                    total: data.docs.length,
                    per_page: perPage,
                    current_page: page,
                    last_page: page > 1 ? page - 1 : 1,
                    from: startAt,
                    to: perPage,
                    data: result
                };
                return res.jsonp(response);
            })
                .catch(function (err) {
                return log_1.Errors.onCatch(res, err);
            });
        }
        catch (error) {
            return log_1.Errors.onCrash(res, error);
        }
    }
    static tallyVotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const electionId = req.query.id;
            try {
                return firebase_api_1.firebaseApi
                    .firestore()
                    .collection('votes')
                    .where('electionId', '==', electionId)
                    .get()
                    .then((data) => {
                    const result = [];
                    data.docs.forEach(function (value) {
                        const candidateId = value.get('candidateId');
                        const existing = result.filter(function (x) {
                            return x.candidateId === candidateId;
                        });
                        if (existing.length === 0) {
                            result.push({
                                candidateId,
                                candidate: value.get('candidate'),
                                count: 1
                            });
                        }
                        else {
                            ;
                            existing[0].count++;
                        }
                    });
                    return res.json(result);
                })
                    .catch(function (err) {
                    return log_1.Errors.onCatch(res, err);
                });
            }
            catch (error) {
                return log_1.Errors.onCrash(res, error);
            }
        });
    }
    static createVote(req, res, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!uid || uid.length === 0)
                return log_1.Errors.onCatch(res, 'User not found after auth.');
            const voter = yield voters_1.VoterApi.getVoter(req);
            if (!voter.exists)
                return log_1.Errors.onCatch(res, 'Voter not found after auth.');
            let vote = {};
            try {
                vote = JSON.parse(req.body);
            }
            catch (_a) {
                vote = req.body;
            }
            ;
            vote.voterId = voter.voterId;
            // @ts-ignore
            const voteId = VoteApi.voteId(vote.voterId, vote.electionId);
            try {
                // first check that this voteId does not exist
                return firebase_api_1.firebaseApi
                    .firestore()
                    .collection('votes')
                    .doc(voteId)
                    .get()
                    .then((data) => {
                    if (data.exists) {
                        return res.json(Object.assign(vote, { status: 'already-voted' }));
                    }
                    else {
                        // if not already exists, create it
                        return firebase_api_1.firebaseApi
                            .firestore()
                            .collection('votes')
                            .doc(voteId)
                            .set(vote)
                            .then(() => {
                            log_1.logger.message('/createVote new vote', JSON.stringify(vote));
                            // // @ts-ignore
                            // TODO: integrate blockchain voting
                            // const blockInfo = new BlockInfo(vote, "block-" + vote.electionId);
                            // VoteApi.blockchainQueue.push(blockInfo);
                            return res.json(Object.assign(vote, { status: 'new-vote' }));
                        });
                    }
                })
                    .catch(function (err) {
                    return log_1.Errors.onCatch(res, err);
                });
            }
            catch (error) {
                return log_1.Errors.onCrash(res, error);
            }
        });
    }
    static trackVote(req, res) {
        let reqBody = {};
        try {
            reqBody = JSON.parse(req.body);
        }
        catch (_a) {
            reqBody = req.body;
        }
        try {
            return firebase_api_1.firebaseApi
                .firestore()
                .collection('votes')
                .where('voterId', '==', reqBody.voterId)
                .where('electionId', '==', reqBody.electionId)
                .get()
                .then((querySnapshot) => {
                if (querySnapshot.docs[0])
                    return res.json(querySnapshot.docs[0].data());
                return res.json({});
            })
                .catch(function (err) {
                return log_1.Errors.onCatch(res, err);
            });
        }
        catch (error) {
            return log_1.Errors.onCrash(res, error);
        }
    }
    static trackUID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqBody = {};
            try {
                reqBody = JSON.parse(req.body);
            }
            catch (_a) {
                reqBody = req.body;
            }
            console.log('trackUID', reqBody);
            try {
                // todo: need to auth before call this
                // remove non-digit
                const voter = (yield voters_1.VoterApi.getVoter(req));
                const voterId = voter && voter.voterId ? voter.voterId : null;
                if (!voterId)
                    return res.json({});
                return firebase_api_1.firebaseApi
                    .firestore()
                    .collection('votes')
                    .where('voterId', '==', voterId)
                    .where('electionId', '==', reqBody.electionId)
                    .get()
                    .then((querySnapshot) => {
                    if (querySnapshot.docs[0])
                        return res.json(querySnapshot.docs[0].data());
                    return res.json({});
                })
                    .catch(function (err) {
                    return log_1.Errors.onCatch(res, err);
                });
            }
            catch (error) {
                return log_1.Errors.onCrash(res, error);
            }
        });
    }
}
exports.VoteApi = VoteApi;
//# sourceMappingURL=votes.js.map