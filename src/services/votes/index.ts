import actions from './actions'
import { session } from '@/factory/session'

export default {
    namespaced: true,
    state: {
        vote: {}
    },
    actions,
    mutations: {
        vote(state, payload) {
            state.vote = payload
            session.setVote(state.vote)
        }
    },
    getters: {}
}
