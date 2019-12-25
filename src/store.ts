import Vue from 'vue'
import VueX from 'vuex'
import createLogger from '@/plugins/logger'
import settings from '@/services/settings'
import user from '@/services/user'
import votes from '@/services/votes'
import elections from '@/services/elections'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(VueX)

const store = new VueX.Store({
    modules: {
        settings,
        user,
        votes,
        elections
    },
    state: {},
    mutations: {},
    actions: {},
    getters: {},
    strict: debug,
    plugins: debug ? [createLogger()] : []
})

export default store
