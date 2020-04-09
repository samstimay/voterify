import { api } from '@/factory/api'
import Vote from '@/models/vote'
import { onCatch } from '@/plugins/errors'

export default {
    create({ commit }, { vote }) {
        return api
            .post('createVote', vote)
            .then(function (res) {
                if (res.data.error) {
                    throw res
                }
                commit('vote', res.data)
                return res.data
            })
            .catch(onCatch)
    },

    trackVote({ commit }, { voterId, electionId }) {
        return api
            .post('trackVote', { voterId, electionId })
            .then(function (res) {
                if (res.data.error) {
                    throw res
                }
                return res.data
            })
            .catch(onCatch)
    },

    trackUID({ commit }, { electionId }) {
        return api
            .post('trackUID', { electionId })
            .then(function (res) {
                if (res.data.error) {
                    throw res
                }
                return res.data
            })
            .catch(onCatch)
    },

    getVotes({ commit }, { electionId }) {
        return api
            .get('getVotes/?id=' + electionId)
            .then(function (res) {
                const votes = []
                res.data.forEach((vote) => {
                    votes.push(
                        new Vote(
                            electionId,
                            vote.candidateId,
                            vote.candidate,
                            vote.voterId,
                            vote.date
                        )
                    )
                })
                return votes
            })
            .catch(onCatch)
    }
}
