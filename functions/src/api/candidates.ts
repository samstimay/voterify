import { Application, Request, Response } from 'express'
import { logger, Errors } from '../log'
import { firebaseApi } from '../firebase/firebase-api'
import * as firebase from 'firebase'
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot
import DocumentData = firebase.firestore.DocumentData
import Candidate from '../models/candidate'

class CandidateApi {
    public static createEndpoints(app: Application) {
        app.get('/candidates', function(req: Request, res: Response) {
            logger.message('GET /candidates', logger.parseExpress(req, res))
            return CandidateApi.getCandidates(req, res)
        })
    }

    public static getCandidates(req: Request, res: Response) {
        const electionId = req.query.id
        try {
            return firebaseApi
                .firestore()
                .collection('candidates')
                .where('electionId', '==', electionId)
                .get()
                .then(function(data: any) {
                    const candidates: DocumentData[] = []
                    data.docs.forEach(function(doc: QueryDocumentSnapshot) {
                        candidates.push(doc.data())
                    })
                    return res.json(candidates)
                })
                .catch(function(err: any) {
                    return Errors.onCatch(res, err)
                })
        } catch (error) {
            return Errors.onCrash(res, error)
        }
    }

    public static async addEditCandidate(
        candidate: Candidate
    ): Promise<String> {
        try {
            await firebaseApi
                .firestore()
                .collection('candidates')
                .where('id', '==', candidate.id)
                .get()
                .then(async function(querySnapshot) {
                    if (querySnapshot.empty || querySnapshot.size === 0) {
                        await firebaseApi
                            .firestore()
                            .collection('candidates')
                            .doc(candidate.id)
                            .set({
                                id: candidate.id,
                                name: candidate.name,
                                party: candidate.party,
                                electionId: candidate.electionId,
                                active: true
                            })
                    } else {
                        querySnapshot.forEach(async function(doc) {
                            await firebaseApi
                                .firestore()
                                .collection('candidates')
                                .doc(candidate.id)
                                .update({
                                    name: candidate.name,
                                    party: candidate.party,
                                    active: candidate.active
                                })
                        })
                    }
                })
        } catch (error) {
            return Errors.log(JSON.stringify(error))
        }

        return ''
    }
}

export { CandidateApi }
