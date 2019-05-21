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
const auth_api_1 = require("./auth-api");
class VoteApi {
    static voteId(voterId, electionId) {
        return electionId + "-" + voterId;
    }
    static createEndpoints(app) {
        app.get("/checkVote", function (req, res) {
            log_1.logger.message("GET /checkVote", log_1.logger.parseExpress(req, res));
            return VoteApi.checkVote(req, res);
        });
        app.post("/createVote", function (req, res) {
            log_1.logger.message("GET /checkVote", log_1.logger.parseExpress(req, res));
            return auth_api_1.authApi
                .firebaseTokenAuth(req)
                .then(isAuth => {
                if (isAuth)
                    return VoteApi.createVote(req, res);
                else
                    return log_1.Errors.authFailed(req, res);
            })
                .catch((msg) => {
                return log_1.Errors.onCatch(res, msg);
            });
        });
    }
    static checkVote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const voterId = req.query.voterId, electionId = req.query.id, voteId = VoteApi.voteId(voterId, electionId);
            try {
                return yield firebase_api_1.firebaseApi
                    .firestore()
                    .collection("votes")
                    .doc(voteId)
                    .get()
                    .then((data) => {
                    var result = {
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
        });
    }
    static createVote(req, res) {
        const vote = JSON.parse(req.body), voteId = VoteApi.voteId(vote.voterId, vote.electionId);
        try {
            // first check that this voteId does not exist
            return firebase_api_1.firebaseApi
                .firestore()
                .collection("votes")
                .doc(voteId)
                .get()
                .then((data) => {
                console.log("vote exists", data.exists);
                if (data.exists) {
                    return res.json(Object.assign(vote, { status: "already-voted" }));
                }
                else {
                    // if not already exists, create it
                    return firebase_api_1.firebaseApi
                        .firestore()
                        .collection("votes")
                        .doc(voteId)
                        .set(vote)
                        .then(() => {
                        return res.json(Object.assign(vote, { status: "new-vote" }));
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
    }
}
exports.VoteApi = VoteApi;
//# sourceMappingURL=votes.js.map