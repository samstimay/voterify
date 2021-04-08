import { Application, Request, Response } from 'express'
import { logger, Errors } from '../log'
import { firebaseApi } from '../firebase/firebase-api'
import { authApi } from './auth-api'
import firebase from 'firebase'
import DocumentSnapshot = firebase.firestore.DocumentSnapshot
const shortid = require('shortid')

class VoterApi {
    public static createEndpoints(app: Application) {
        app.get('/getVoter', function (req: Request, res: Response) {
            logger.message('GET /getVoter', logger.parseExpress(req, res))
            return VoterApi.getVoter(req, res)
        })
        app.get('/createVoter', function (req: Request, res: Response) {
            logger.message('GET /createVoter', logger.parseExpress(req, res))
            return authApi
                .firebaseTokenAuth(req)
                .then((uid) => {
                    if (uid) return VoterApi.createVoter(req, res)
                    else return Errors.authFailed(req, res)
                })
                .catch((msg: any) => {
                    return Errors.onCatch(res, msg)
                })
        })
    }

    public static async getVoter(
        req: Request,
        res?: Response
    ): Promise<object> {
        const uid = await authApi.firebaseTokenAuth(req)
        return firebaseApi
            .firestore()
            .collection('voters')
            .doc(uid)
            .get()
            .then((data: DocumentSnapshot) => {
                const result = {
                    exists: data.exists,
                    uid: data.get('uid'),
                    voterId: data.get('voterId')
                }
                if (res) return res.json(result)
                return result
            })
            .catch((err: any) => {
                Errors.onCatch(res, err)
                return { exists: false, err: err }
            })
    }

    public static voterIdExists(voterId: string): Promise<boolean> {
        logger.debug('voterIdExists', voterId)
        return firebaseApi
            .firestore()
            .collection('voters')
            .where('voterId', '==', voterId)
            .get()
            .then((data: any) => {
                return data.docs && data.docs.length > 0
            })
            .catch(function (err: any) {
                return false
            })
    }

    // recursive function to keep generating a voterId until it's unique
    public static newVoterId(attempts: number): Promise<string> {
        if (attempts > 5) {
            logger.error('newVoterId too many attempts.')
            return new Promise<string>(() => {
                return ''
            })
        }

        const voterId = shortid.generate()
        return this.voterIdExists(voterId).then((exists) => {
            if (!exists) return voterId
            else return VoterApi.newVoterId(attempts + 1)
        })
    }

    public static async createVoter(req: Request, res: Response) {
        try {
            const uid = await authApi.firebaseTokenAuth(req)

            // if the voter exists
            return this.getVoter(req).then((data) => {
                const existingVoter = data as any
                // if Voter already exists, return that
                if (
                    existingVoter.exists &&
                    existingVoter.voterId &&
                    existingVoter.voterId.length
                )
                    return res.json(existingVoter)
                // Voter does not exist, create a new unique voterId first
                else
                    return VoterApi.newVoterId(0)
                        .then(function (voterId) {
                            const voter = {
                                uid: uid.trim(),
                                voterId: voterId.trim()
                            }

                            logger.message(
                                'Creating new voter: ' + JSON.stringify(voter)
                            )

                            // now create the Voter
                            return firebaseApi
                                .firestore()
                                .collection('voters')
                                .doc(uid)
                                .set(voter)
                                .then(() => {
                                    return res.json(voter)
                                })
                                .catch(function (err: any) {
                                    return Errors.onCatch(res, err)
                                })
                        })
                        .catch(() => {
                            return Errors.onCatch(res, req)
                        })
            })
        } catch (error) {
            return Errors.onCrash(res, error)
        }
    }
}

export { VoterApi }
