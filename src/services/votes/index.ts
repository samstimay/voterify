import actions from './actions'

export default {
    namespaced: true,
    state: {
        vote: {}
    },
    actions,
    mutations: {
        vote(state, payload) {
            state.vote = payload
        }
    },
    getters: {}
}
