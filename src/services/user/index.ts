import actions from './actions'

export default {
    namespaced: true,
    state: {
        user: {}, // the firebase user
        voter: {} // the voter
    },
    actions,
    mutations: {
        user(state, payload) {
            state.user = payload
        },
        voter(state, payload) {
            state.voter = payload
        }
    },
    getters: {}
}
