import { Application, Request, Response } from 'express'
import { logger, Errors } from '../log'
import { firebaseApi } from '../firebase/firebase-api'
import firebase from 'firebase'
import DocumentSnapshot = firebase.firestore.DocumentSnapshot

class SystemApi {
    public static createEndpoints(app: Application) {
        app.get('/info', function (req: Request, res: Response) {
            logger.message('GET /info', logger.parseExpress(req, res))
            return SystemApi.getInfo(req, res)
        })
    }

    public static getInfo(req: Request, res: Response) {
        try {
            return firebaseApi
                .firestore()
                .collection('System')
                .doc('votery')
                .get()
                .then((data: DocumentSnapshot) => {
                    const result = {
                        version: data.get('version')
                    }
                    if (res) return res.json(result)
                    return result
                })
        } catch (error) {
            return Errors.onCrash(res, error)
        }
    }
}

export { SystemApi }
