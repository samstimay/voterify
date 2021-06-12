import { logger } from '../log'
import firebase from 'firebase'
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot
import { firebaseApi } from '../firebase/firebase-api'
import Election from '../models/election'
import Candidate from '../models/candidate'

function updateVotes(candidate: Candidate) {
    firebaseApi
        .firestore()
        .collection('candidates')
        .where('id', '==', candidate.id)
        .get()
        .then(async function (querySnapshot) {
            if (querySnapshot.empty || querySnapshot.size === 0) {
                logger.error(`Candidate does not exist ${candidate}`)
            } else {
                querySnapshot.forEach(async function (doc) {
                    logger.debug(`Updating ${candidate.name} with ${candidate.votes}`)
                    await firebaseApi
                        .firestore()
                        .collection('candidates')
                        .doc(candidate.id)
                        .update({
                            votes: candidate.votes
                        })
                })
            }
        })
}

function voteCountJob(context: any) {
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
                                        updateVotes(candidate)
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