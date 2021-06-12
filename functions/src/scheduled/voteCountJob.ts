import { logger } from '../log'
import firebase from 'firebase'
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot
import DocumentData = firebase.firestore.DocumentData
import { firebaseApi } from '../firebase/firebase-api'
import Election from '../models/election'
import Candidate from '../models/candidate'

function voteCountJob(context: any, functions: any) {
    logger.debug(`vote count job running at ${Date.now()} with ${context}`)

    try {
        firebaseApi
            .firestore()
            .collection('elections')
            .get()
            .then(function (data: any) {
                const elections: Election[] = []
                data.docs.forEach(function (doc: QueryDocumentSnapshot) {
                    let data = doc.data()
                    if (data.active) {
                        elections.push(new Election(
                            data.name,
                            data.id,
                            data.region,
                            data.date,
                            [],
                            true
                        ))
                    }
                })

                elections.forEach(election => {
                    firebaseApi
                        .firestore()
                        .collection('candidates')
                        .where('electionId', '==', election.id)
                        .get()
                        .then(function (data: any) {
                            data.docs.forEach(function (doc: QueryDocumentSnapshot) {
                                let data = doc.data()
                                election.candidates.push(new Candidate(
                                    data.name,
                                    data.id,
                                    data.party,
                                    election.id,
                                    data.active
                                ))
                            })
                            election.candidates.forEach(candidate => {
                                firebaseApi
                                    .firestore()
                                    .collection('votes')
                                    .where('candidateId', '==', candidate.id)
                                    .get()
                                    .then(function (data: any) {
                                        candidate.votes = data.docs.length
                                        logger.debug(`Candidate ${candidate.name} has ${candidate.votes} votes`)
                                    })
                            })
                        })
                })
            })
    } catch (error) {
        return logger.error(error)
    }
}

export default voteCountJob