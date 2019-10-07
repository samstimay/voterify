import { Application, Request, Response } from "express";
import { logger, Errors } from "../log";
import { firebaseApi } from "../firebase/firebase-api";
import { authApi } from "./auth-api";
import * as firebase from "firebase";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
const shortid = require("shortid");

class VoterApi {
    public static createEndpoints(app: Application) {
        app.get("/getVoter", function(req: Request, res: Response) {
            logger.message("GET /getVoter", logger.parseExpress(req, res));
            return VoterApi.getVoter(req.query.id, res);
        });
        app.get("/createVoter", function(req: Request, res: Response) {
            logger.message("GET /createVoter", logger.parseExpress(req, res));
            return authApi
                .firebaseTokenAuth(req)
                .then(uid => {
                    if (uid) return VoterApi.createVoter(req, res);
                    else return Errors.authFailed(req, res);
                })
                .catch((msg: any) => {
                    return Errors.onCatch(res, msg);
                });
        });
    }

    public static getVoter(phone: string, res?: Response): Promise<object> {
        const phoneKey = phone.replace(/[^0-9\.]+/g, "").trim();
        return firebaseApi
            .firestore()
            .collection("voters")
            .doc(phoneKey)
            .get()
            .then((data: DocumentSnapshot) => {
                const result = {
                    exists: data.exists,
                    phone: data.get("phone"),
                    uid: data.get("uid"),
                    voterId: data.get("voterId")
                };
                if (res) return res.json(result);
                return result;
            })
            .catch((err: any) => {
                return { exists: false, err: err };
            });
    }

    public static voterIdExists(voterId: string): Promise<boolean> {
        logger.debug("voterIdExists", voterId);
        return firebaseApi
            .firestore()
            .collection("voters")
            .where("voterId", "==", voterId)
            .get()
            .then((data: any) => {
                return data.docs && data.docs.length > 0;
            })
            .catch(function(err: any) {
                return false;
            });
    }

    // recursive function to keep generating a voterId until it's unique
    public static newVoterId(attempts: number): Promise<string> {
        if (attempts > 5) {
            logger.error("newVoterId too many attempts.");
            return new Promise<string>(() => {
                return "";
            });
        }

        const voterId = shortid.generate();
        return this.voterIdExists(voterId).then(exists => {
            if (!exists) return voterId;
            else return VoterApi.newVoterId(attempts + 1);
        });
    }

    public static createVoter(req: Request, res: Response) {
        try {
            const uid = req.query.uid,
                phone = req.query.id.trim();

            // if the voter exists
            return this.getVoter(phone).then(data => {
                const existingVoter = data as any;
                // if Voter already exists, return that
                if (
                    existingVoter.exists &&
                    existingVoter.voterId &&
                    existingVoter.voterId.length
                )
                    return res.json(existingVoter);
                // Voter does not exist, create a new unique voterId first
                else
                    return VoterApi.newVoterId(0)
                        .then(function(voterId) {
                            const voter = {
                                phone: phone,
                                uid: uid.trim(),
                                voterId: voterId.trim()
                            };

                            logger.message(
                                "Creating new voter: " + JSON.stringify(voter)
                            );

                            // now create the Voter
                            return firebaseApi
                                .firestore()
                                .collection("voters")
                                .doc(phone)
                                .set(voter)
                                .then(() => {
                                    return res.json(voter);
                                })
                                .catch(function(err: any) {
                                    return Errors.onCatch(res, err);
                                });
                        })
                        .catch(() => {
                            return Errors.onCatch(res, req);
                        });
            });
        } catch (error) {
            return Errors.onCrash(res, error);
        }
    }
}

export { VoterApi };
