import { Application, Request, Response } from 'express'
import { logger, Errors } from '../log'
import { firebaseApi } from '../firebase/firebase-api'
import firebase from 'firebase/compat/app'
import DocumentSnapshot = firebase.firestore.DocumentSnapshot

class SystemApi {
    public static createEndpoints(app: Application) {
        app.get('/info', function (req: Request, res: Response) {
            logger.message('GET /info', logger.parseExpress(req, res))
            return SystemApi.getInfo(req, res)
        })
    }


}

export { SystemApi }
