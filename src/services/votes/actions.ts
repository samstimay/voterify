import { api } from '@/factory/api'
import Vote from '@/models/vote'

export default {
    create({ commit }, { vote }) {
        return api.post('createVote', vote).then(function(res) {
            if (res.data.error) {
                throw res
            }
            commit('vote', res.data)
            return res.data
        })
    },

    trackVote({ commit }, { voterId, electionId }) {
        return api
            .post('trackVote', { voterId, electionId })
            .then(function(res) {
                if (res.data.error) {
                    throw res
                }
                return res.data
            })
    },

    trackUID({ commit }, { electionId }) {
        return api.post('trackUID', { electionId }).then(function(res) {
            if (res.data.error) {
                throw res
            }
            return res.data
        })
    },

    getVotes({ commit }, { electionId }) {
        return api.get('getVotes/?id=' + electionId).then(function(res) {
            const votes = []
            res.data.forEach(vote => {
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
    }
}
