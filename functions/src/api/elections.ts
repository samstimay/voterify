import { Application, Request, Response } from 'express'
import { logger, Errors } from '../log'
import { firebaseApi } from '../firebase/firebase-api'
import { PermissionsApi } from './permissions'
import { authApi } from './auth-api'
import * as firebase from 'firebase'
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot
import DocumentData = firebase.firestore.DocumentData
import Permissions from '../models/permissions'

class ElectionApi {
    public static createEndpoints(app: Application) {
        app.get('/elections', function(req: Request, res: Response) {
            logger.message('GET /elections', logger.parseExpress(req, res))
            return ElectionApi.getElections(req, res)
        })
        app.get('/elections/edit', function(req: Request, res: Response) {
            logger.message('GET /elections/edit', logger.parseExpress(req, res))

            return authApi
                .firebaseTokenAuth(req)
                .then(async uid => {
                    if (uid) {
                        const permission = await PermissionsApi.getPermissions(
                            uid
                        )
                        return ElectionApi.getEditElections(
                            req,
                            res,
                            uid,
                            permission
                        )
                    } else return Errors.authFailed(req, res)
                })
                .catch((msg: any) => {
                    return Errors.onCatch(res, msg)
                })
        })
    }
    public static getElections(req: Request, res: Response) {
        try {
            return firebaseApi
                .firestore()
                .collection('elections')
                .get()
                .then(function(data: any) {
                    const elections: DocumentData[] = []
                    data.docs.forEach(function(doc: QueryDocumentSnapshot) {
                        elections.push(doc.data())
                    })
                    return res.json(elections)
                })
                .catch(function(err: any) {
                    return Errors.onCatch(res, err)
                })
        } catch (error) {
            return Errors.onCrash(res, error)
        }
    }

    public static getEditElections(
        req: Request,
        res: Response,
        uid: string,
        permissions: Permissions
    ) {
        if (!permissions.isAdmin()) return res.json([])

        try {
            return firebaseApi
                .firestore()
                .collection('elections')
                .where('admin', '==', uid)
                .get()
                .then(function(data: any) {
                    const elections: DocumentData[] = []
                    data.docs.forEach(function(doc: QueryDocumentSnapshot) {
                        elections.push(doc.data())
                    })
                    return res.json(elections)
                })
                .catch(function(err: any) {
                    return Errors.onCatch(res, err)
                })
        } catch (error) {
            return Errors.onCrash(res, error)
        }
    }
}

export { ElectionApi }
