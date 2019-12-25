import http from '@/services/http'
const fileName = '/settings.json'

export default {
    namespaced: true,
    state: {
        settings: {},
        apiPath: {}
    },
    actions: {
        get({ commit }) {
            return http
                .get(fileName)
                .then(function(res) {
                    commit('getSettings', res)
                })
                .catch(function(res) {
                    console.log('api init failed', res)
                })
        }
    },
    mutations: {
        getSettings(state, payload) {
            state.settings = payload.data
            state.apiPath =
                payload.data.apiHost +
                (payload.data.apiPort ? ':' + payload.data.apiPort : '') +
                payload.data.apiPath
        }
    },
    getters: {
        apiPath: state => state.apiPath,
        settings: state => state.settings
    }
}
