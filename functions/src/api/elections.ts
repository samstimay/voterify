import { Application, Request, Response } from 'express'
import { logger, Errors } from '../log'
import { firebaseApi } from '../firebase/firebase-api'
import { PermissionsApi } from './permissions'
import { authApi } from './auth-api'
import firebase from 'firebase'
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot
import DocumentData = firebase.firestore.DocumentData
import Permissions from '../models/permissions'
import Election from '../models/election'
import { CandidateApi } from './candidates'

class ElectionApi {
    public static createEndpoints(app: Application) {
        app.get('/elections', function (req: Request, res: Response) {
            logger.message('GET /elections', logger.parseExpress(req, res))
            return ElectionApi.getElections(req, res)
        })
        app.get('/elections/edit', function (req: Request, res: Response) {
            logger.message('GET /elections/edit', logger.parseExpress(req, res))

            return authApi
                .firebaseTokenAuth(req)
                .then(async (uid) => {
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
        app.post('/elections/edit', function (req: Request, res: Response) {
            logger.message(
                'POST /elections/edit',
                logger.parseExpress(req, res)
            )

            return authApi
                .firebaseTokenAuth(req)
                .then(async (uid) => {
                    if (uid) {
                        const permission = await PermissionsApi.getPermissions(
                            uid
                        )
                        return ElectionApi.editElection(
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
                .then(function (data: any) {
                    const elections: DocumentData[] = []
                    data.docs.forEach(function (doc: QueryDocumentSnapshot) {
                        elections.push(doc.data())
                    })
                    return res.json(elections)
                })
                .catch(function (err: any) {
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
                .then(function (data: any) {
                    const elections: DocumentData[] = []
                    data.docs.forEach(function (doc: QueryDocumentSnapshot) {
                        elections.push(doc.data())
                    })
                    return res.json(elections)
                })
                .catch(function (err: any) {
                    return Errors.onCatch(res, err)
                })
        } catch (error) {
            return Errors.onCrash(res, error)
        }
    }

    public static async editElection(
        req: Request,
        res: Response,
        uid: string,
        permissions: Permissions
    ) {
        const errors = []
        if (!permissions.isAdmin()) return res.json([])

        const election = new Election(
            req.body.name,
            req.body.id,
            req.body.region,
            req.body.date,
            req.body.candidates || [],
            req.body.active
        )

        if (!election.id) errors.push('No election ID')

        try {
            if (errors.length === 0) {
                await firebaseApi
                    .firestore()
                    .collection('elections')
                    .where('id', '==', election.id)
                    .get()
                    .then(async function (querySnapshot) {
                        if (querySnapshot.empty || querySnapshot.size === 0) {
                            await firebaseApi
                                .firestore()
                                .collection('elections')
                                .doc(election.id)
                                .set({
                                    id: election.id,
                                    name: election.name,
                                    region: election.region,
                                    date: new Date(),
                                    admin: uid,
                                    active: true
                                })
                        } else {
                            querySnapshot.forEach(async function (doc) {
                                if (doc.get('admin') === uid) {
                                    await firebaseApi
                                        .firestore()
                                        .collection('elections')
                                        .doc(doc.id)
                                        .update({
                                            name: election.name,
                                            region: election.region,
                                            active: election.active
                                        })
                                } else {
                                    errors.push(
                                        'You are not the admin of this election.'
                                    )
                                }
                            })
                        }
                    })
                election.candidates.forEach(async (candidate) => {
                    if (errors.length) return
                    const err = await CandidateApi.addEditCandidate(candidate)
                    if (err.length) {
                        errors.push(err)
                    }
                })
            }
            if (errors.length) return res.json({ errors })
            else return res.json(election)
        } catch (error) {
            return Errors.onCrash(res, error)
        }
    }
}

export { ElectionApi }
