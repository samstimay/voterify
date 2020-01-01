import { api } from '@/factory/api'
import Election from '@/models/election'
import Candidate from '@/models/candidate'
import { onCatch } from '@/plugins/errors'

// getElections
// getDefaultElection
// getCandidates
// electionFactory

export default {
    get({ commit }) {
        return api
            .get('elections')
            .then(function(res) {
                const elections = []
                res.data.forEach(election => {
                    elections.push(
                        new Election(
                            election.name,
                            election.id,
                            election.region,
                            election.date,
                            [],
                            election.active
                        )
                    )
                })
                commit('elections', elections)
                return elections
            })
            .catch(onCatch)
    },

    getCandidates({ commit }, { electionId }) {
        return api
            .get('candidates/?id=' + electionId)
            .then(function(res) {
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
            .catch(onCatch)
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
            .catch(onCatch)
    },

    getEditable({ state }): Promise<Election[]> {
        return api
            .get('elections/edit')
            .then(function(res) {
                const elections = []
                res.data.forEach(election => {
                    elections.push(
                        new Election(
                            election.name,
                            election.id,
                            election.region,
                            election.date,
                            election.candidates,
                            election.active
                        )
                    )
                })

                return elections
            })
            .catch(onCatch)
    },

    setCurrent({ commit }, { election }) {
        commit('currentElection', election)
    },

    save({ commit }, { election }) {
        return api
            .post('elections/edit', election)
            .then(function(res) {
                const result = new Election(
                    res.data.name,
                    res.data.id,
                    res.data.region,
                    res.data.date,
                    res.data.candidates,
                    res.data.active
                )
                commit('currentElection', result)
                return result
            })
            .catch(onCatch)
    }
}
