import actions from './actions'

export default {
    namespaced: true,
    state: {
        currentElection: {},
        currentCandidate: {},
        elections: [],
        candidates: []
    },
    actions,
    mutations: {
        elections(state, payload) {
            state.elections = payload
        },
        candidates(state, payload) {
            state.candidates = payload
        },
        currentElection(state, payload) {
            state.currentElection = payload
        },
        currentCandidate(state, payload) {
            state.currentCandidate = payload
        }
    },
    getters: {
        defaultElection(state) {
            return state.elections[0] || {}
        }
    }
}
