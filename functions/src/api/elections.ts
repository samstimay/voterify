import { Application, Request, Response } from "express";
import { logger, Errors } from "../log";
import { firebaseApi } from "../firebase/firebase-api";
import * as firebase from "firebase";
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import DocumentData = firebase.firestore.DocumentData;

class ElectionApi {
    public static createEndpoints(app: Application) {
        app.get("/elections", function(req: Request, res: Response) {
            logger.message("GET /elections", logger.parseExpress(req, res));
            return ElectionApi.getElections(req, res);
        });
    }
    public static getElections(req: Request, res: Response) {
        try {
            return firebaseApi
                .firestore()
                .collection("elections")
                .get()
                .then(function(data: any) {
                    const elections: DocumentData[] = [];
                    data.docs.forEach(function(doc: QueryDocumentSnapshot) {
                        elections.push(doc.data());
                    });
                    return res.json(elections);
                })
                .catch(function(err: any) {
                    return Errors.onCatch(res, err);
                });
        } catch (error) {
            return Errors.onCrash(res, error);
        }
    }
}

export { ElectionApi };
