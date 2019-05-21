import { Application, Request, Response } from "express";
import { logger, Errors } from "../log";
import { firebaseApi } from "../firebase/firebase-api";
import { authApi } from "./auth-api";
import * as firebase from "firebase";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

class PhoneApi {
    public static createEndpoints(app: Application) {
        app.get("/phone", function(req: Request, res: Response) {
            logger.message("GET /phone", logger.parseExpress(req, res));
            return authApi
                .firebaseTokenAuth(req)
                .then(uid => {
                    if (uid) return PhoneApi.getPhone(req, res);
                    else return Errors.authFailed(req, res);
                })
                .catch((msg: any) => {
                    return Errors.onCatch(res, msg);
                });
        });
        app.post("/phone", function(req: any, res: any) {
            logger.message("POST /phone", logger.parseExpress(req, res));
            logger.debug("POST /phone", req, res);
            return Errors.notImplemented(res);
        });
    }

    public static getPhone(req: Request, res: Response) {
        try {
            let phone = req.query.id;
            if (phone.indexOf("+") >= 0) phone = phone.replace("+", "");

            return firebaseApi
                .firestore()
                .collection("voters")
                .doc(phone)
                .get()
                .then((data: DocumentSnapshot) => {
                    const result = {
                        exists: data.exists,
                        phone: data.get("phone"),
                        uid: data.get("uid")
                    };
                    return res.json(result);
                })
                .catch((err: any) => {
                    return Errors.onCatch(res, err);
                });
        } catch (error) {
            return Errors.onCrash(res, error);
        }
    }
}

export { PhoneApi };
