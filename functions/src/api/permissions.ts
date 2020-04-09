import { Application, Request, Response } from 'express'
import { logger, Errors } from '../log'
import { firebaseApi } from '../firebase/firebase-api'
import { authApi } from './auth-api'
import Permissions from '../models/permissions'
import * as firebase from 'firebase'
import DocumentSnapshot = firebase.firestore.DocumentSnapshot

class PermissionsApi {
    public static createEndpoints(app: Application) {
        app.get('/permission', function (req: Request, res: Response) {
            logger.message('GET /permission', logger.parseExpress(req, res))
            return authApi
                .firebaseTokenAuth(req)
                .then((uid) => {
                    if (uid)
                        return PermissionsApi.getPermissionsResponse(
                            req,
                            res,
                            uid
                        )
                    else return Errors.authFailed(req, res)
                })
                .catch((msg: any) => {
                    return Errors.onCatch(res, msg)
                })
        })
    }

    public static getPermissions(uid: string): Promise<Permissions> {
        return firebaseApi
            .firestore()
            .collection('permissions')
            .doc(uid)
            .get()
            .then((data: DocumentSnapshot) => {
                if (data.exists) {
                    return new Permissions(data.get('type'))
                } else {
                    return new Permissions('')
                }
            })
            .catch(function (err: any) {
                throw err
            })
    }

    public static getPermissionsResponse(
        req: Request,
        res: Response,
        uid: string
    ) {
        try {
            return this.getPermissions(uid)
                .then((permissions) => {
                    return res.json(permissions)
                })
                .catch(function (err: any) {
                    throw err
                })
        } catch (error) {
            return Errors.onCrash(res, error)
        }
    }
}

export { PermissionsApi }
