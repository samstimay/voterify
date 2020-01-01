import actions from './actions'
import Permissions from '@/models/permissions'
import { session } from '@/factory/session'

export default {
    namespaced: true,
    state: {
        isLoggedIn: false,
        user: {}, // the firebase user
        voter: {}, // the voter
        permissions: new Permissions('')
    },
    actions,
    mutations: {
        user(state, payload) {
            state.user = payload
            state.isLoggedIn = state.user.uid && state.user.uid.length
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
