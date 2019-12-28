import actions from './actions'
import { session } from '@/factory/session'

export default {
    namespaced: true,
    state: {
        user: {}, // the firebase user
        voter: {}, // the voter
        permissions: {}
    },
    actions,
    mutations: {
        user(state, payload) {
            state.user = payload
            session.setUser(state.user)
        },
        voter(state, payload) {
            state.voter = payload
            session.setVoter(state.voter)
        },
        permissions(state, payload) {
            state.permissions = payload
        }
    },
    getters: {}
}
