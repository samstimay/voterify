import actions from './actions'
import Permissions from '@/models/permissions'
import { session } from '@/factory/session'

export default {
    namespaced: true,
    state: {
        user: {}, // the firebase user
        voter: {}, // the voter
        permissions: new Permissions('')
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
