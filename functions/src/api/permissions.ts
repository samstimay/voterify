import { Application, Request, Response } from 'express'
import { logger, Errors } from '../log'
import { firebaseApi } from '../firebase/firebase-api'
import { authApi } from './auth-api'
import * as firebase from 'firebase'
import DocumentSnapshot = firebase.firestore.DocumentSnapshot

class PermissionsApi {
    public static createEndpoints(app: Application) {
        app.get('/permission', function(req: Request, res: Response) {
            logger.message('GET /permission', logger.parseExpress(req, res))
            return authApi
                .firebaseTokenAuth(req)
                .then(uid => {
                    if (uid) return PermissionsApi.getPermissions(req, res, uid)
                    else return Errors.authFailed(req, res)
                })
                .catch((msg: any) => {
                    return Errors.onCatch(res, msg)
                })
        })
    }
    public static getPermissions(req: Request, res: Response, uid: string) {
        try {
            return firebaseApi
                .firestore()
                .collection('permissions')
                .doc(uid)
                .get()
                .then((data: DocumentSnapshot) => {
                    if (data.exists) {
                        return res.json({ type: data.get('type') })
                    } else {
                        return res.json({ type: '' })
                    }
                })
                .catch(function(err: any) {
                    return Errors.onCatch(res, err)
                })
        } catch (error) {
            return Errors.onCrash(res, error)
        }
    }
}

export { PermissionsApi }
