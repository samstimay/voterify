import { api } from '@/factory/api'
import Election from '@/models/election'
import Candidate from '@/models/candidate'

// getElections
// getDefaultElection
// getCandidates
// electionFactory

export default {
    get({ commit }) {
        return api.get('elections').then(function(res) {
            const elections = []
            res.data.forEach(election => {
                elections.push(
                    new Election(
                        election.name,
                        election.id,
                        election.region,
                        election.date,
                        []
                    )
                )
            })
            commit('elections', elections)
            return elections
        })
    },

    getCandidates({ commit }, { electionId }) {
        return api.get('candidates/?id=' + electionId).then(function(res) {
            const candidates = []
            res.data.forEach(candidate => {
                candidates.push(
                    new Candidate(
                        candidate.name,
                        candidate.id,
                        candidate.party,
                        candidate.electionId
                    )
                )
            })
            commit('candidates', candidates)
            return candidates
        })
    },

    hasVoterVoted({ state }, { voter }) {
        return api
            .get(
                'checkVote/?id=' +
                    state.currentElection.id +
                    '&voterId=' +
                    voter.voterId
            )
            .then(function(res) {
                return res.data.exists === true
            })
    }
}
