import { Application, Request, Response } from "express";
import { logger, Errors } from "../log";
import { firebaseApi } from "../firebase/firebase-api";
import * as firebase from "firebase";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import { authApi } from "./auth-api";
import QuerySnapshot = firebase.firestore.QuerySnapshot;
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import { VoterApi } from "./voters";
// import { BlockInfo } from "../blockchain/blockService"
const cors = require("cors");

class VoteApi {

    public static blockchainQueue: any;

    public static voteId(voterId: string, electionId: string): string {
        return electionId + "-" + voterId;
    }

    public static createEndpoints(app: Application) {
        app.get("/checkVote", function (req: Request, res: Response) {
            logger.message("GET /checkVote", logger.parseExpress(req, res));
            return VoteApi.checkVote(req, res);
        });
        app.get("/getVotes", function (req: Request, res: Response) {
            logger.message("GET /getVotes", logger.parseExpress(req, res));
            return VoteApi.getVotes(req, res);
        });
        app.get("/getVotesTable", cors(), function (
            req: Request,
            res: Response
        ) {
            logger.message("GET /getVotesTable", logger.parseExpress(req, res));
            return VoteApi.getVotesTable(req, res);
        });
        app.get("/tallyVotes", function (req: Request, res: Response) {
            logger.message("GET /tallyVotes", logger.parseExpress(req, res));
            return VoteApi.tallyVotes(req, res);
        });
        app.post("/trackVote", function (req: Request, res: Response) {
            logger.message("POST /trackVote", logger.parseExpress(req, res));
            return VoteApi.trackVote(req, res);
        });
        app.post("/trackUID", function (req: Request, res: Response) {
            logger.message("POST /trackUID", logger.parseExpress(req, res));
            return VoteApi.trackUID(req, res);
        });
        app.post("/createVote", function (req: Request, res: Response) {
            logger.message("POST /createVote", logger.parseExpress(req, res));
            return authApi
                .firebaseTokenAuth(req)
                .then(uid => {
                    if (uid) return VoteApi.createVote(req, res, uid);
                    else return Errors.authFailed(req, res);
                })
                .catch((msg: any) => {
                    return Errors.onCatch(res, msg);
                });
        });
    }

    public static checkVote(req: Request, res: Response) {
        const voterId = req.query.voterId.toString(),
            electionId = req.query.id.toString(),
            voteId = VoteApi.voteId(voterId, electionId);

        try {
            return firebaseApi
                .firestore()
                .collection("votes")
                .doc(voteId)
                .get()
                .then((data: DocumentSnapshot) => {
                    const result = {
                        exists: data.exists
                    };
                    return res.json(result);
                })
                .catch(function (err: any) {
                    return Errors.onCatch(res, err);
                });
        } catch (error) {
            return Errors.onCrash(res, error);
        }
    }

    public static getVotes(req: Request, res: Response) {
        const electionId = req.query.id;

        try {
            return firebaseApi
                .firestore()
                .collection("votes")
                .where("electionId", "==", electionId)
                .get()
                .then((data: QuerySnapshot) => {
                    const result = [] as Object[];
                    data.docs.forEach(function (value: QueryDocumentSnapshot) {
                        result.push({
                            voterId: value.get("voterId"),
                            candidateId: value.get("candidateId"),
                            candidate: value.get("candidate"),
                            date: value.get("date")
                        });
                    });
                    return res.json(result);
                })
                .catch(function (err: any) {
                    return Errors.onCatch(res, err);
                });
        } catch (error) {
            return Errors.onCrash(res, error);
        }
    }

    public static getVotesTable(req: Request, res: Response) {
        const electionId = req.query.id,
            page = Number(req.query.page),
            perPage = Number(req.query.per_page),
            startAt = 1 + (page - 1) * perPage;

        let sort = req.query.sort;
        if (sort !== "electionId") sort = "date";

        try {
            return firebaseApi
                .firestore()
                .collection("votes")
                .where("electionId", "==", electionId)
                .orderBy(sort)
                .startAt(startAt)
                .limit(perPage)
                .get()
                .then((data: QuerySnapshot) => {
                    const result = [] as Object[];
                    data.docs.forEach(function (value: QueryDocumentSnapshot) {
                        result.push({
                            voterId: value.get("voterId"),
                            candidateId: value.get("candidateId"),
                            candidate: value.get("candidate"),
                            date: value.get("date")
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
                .catch(function (err: any) {
                    return Errors.onCatch(res, err);
                });
        } catch (error) {
            return Errors.onCrash(res, error);
        }
    }

    public static async tallyVotes(req: Request, res: Response) {
        const electionId = req.query.id;

        try {
            return firebaseApi
                .firestore()
                .collection("votes")
                .where("electionId", "==", electionId)
                .get()
                .then((data: QuerySnapshot) => {
                    const result = [] as Object[];
                    data.docs.forEach(function (value: QueryDocumentSnapshot) {
                        const candidateId = value.get("candidateId");
                        const existing = result.filter(function (x) {
                            return (x as any).candidateId === candidateId;
                        });
                        if (existing.length === 0) {
                            result.push({
                                candidateId,
                                candidate: value.get("candidate"),
                                count: 1
                            });
                        } else {
                            (existing[0] as any).count++;
                        }
                    });
                    return res.json(result);
                })
                .catch(function (err: any) {
                    return Errors.onCatch(res, err);
                });
        } catch (error) {
            return Errors.onCrash(res, error);
        }
    }

    public static async createVote(req: Request, res: Response, uid: string) {
        if (!uid || uid.length === 0)
            return Errors.onCatch(res, "User not found after auth.");
        const voter = await VoterApi.getVoter(req);
        if (!(voter as any).exists)
            return Errors.onCatch(res, "Voter not found after auth.");

        let vote = {};

        try {
            vote = JSON.parse(req.body);
        } catch {
            vote = req.body;
        }

        (vote as any).voterId = (voter as any).voterId;

        // @ts-ignore
        const voteId = VoteApi.voteId(vote.voterId, vote.electionId);

        try {
            // first check that this voteId does not exist
            return firebaseApi
                .firestore()
                .collection("votes")
                .doc(voteId)
                .get()
                .then((data: DocumentSnapshot) => {
                    if (data.exists) {
                        return res.json(
                            Object.assign(vote, { status: "already-voted" })
                        );
                    } else {
                        // if not already exists, create it
                        return firebaseApi
                            .firestore()
                            .collection("votes")
                            .doc(voteId)
                            .set(vote)
                            .then(() => {
                                logger.message("/createVote new vote", JSON.stringify(vote));
                                // // @ts-ignore
                                // TODO: integrate blockchain voting
                                // const blockInfo = new BlockInfo(vote, "block-" + vote.electionId);
                                // VoteApi.blockchainQueue.push(blockInfo);
                                return res.json(
                                    Object.assign(vote, { status: "new-vote" })
                                );
                            });
                    }
                })
                .catch(function (err: any) {
                    return Errors.onCatch(res, err);
                });
        } catch (error) {
            return Errors.onCrash(res, error);
        }
    }

    public static trackVote(req: Request, res: Response) {
        let reqBody = {};
        try {
            reqBody = JSON.parse(req.body);
        } catch {
            reqBody = req.body;
        }

        try {
            return firebaseApi
                .firestore()
                .collection("votes")
                .where("voterId", "==", (reqBody as any).voterId)
                .where("electionId", "==", (reqBody as any).electionId)
                .get()
                .then((querySnapshot: QuerySnapshot) => {
                    if (querySnapshot.docs[0])
                        return res.json(querySnapshot.docs[0].data());

                    return res.json({});
                })
                .catch(function (err: any) {
                    return Errors.onCatch(res, err);
                });
        } catch (error) {
            return Errors.onCrash(res, error);
        }
    }

    public static async trackUID(req: Request, res: Response) {
        let reqBody = {};
        try {
            reqBody = JSON.parse(req.body);
        } catch {
            reqBody = req.body;
        }
        console.log("trackUID", reqBody);

        try {
            // todo: need to auth before call this
            // remove non-digit
            const voter = (await VoterApi.getVoter(req)) as any;
            const voterId = voter && voter.voterId ? voter.voterId : null;
            if (!voterId) return res.json({});
            return firebaseApi
                .firestore()
                .collection("votes")
                .where("voterId", "==", voterId)
                .where("electionId", "==", (reqBody as any).electionId)
                .get()
                .then((querySnapshot: QuerySnapshot) => {
                    if (querySnapshot.docs[0])
                        return res.json(querySnapshot.docs[0].data());

                    return res.json({});
                })
                .catch(function (err: any) {
                    return Errors.onCatch(res, err);
                });
        } catch (error) {
            return Errors.onCrash(res, error);
        }
    }
}

export { VoteApi };
