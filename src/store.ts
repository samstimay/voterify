// https://medium.com/@mario.brendel1990/vue-3-the-new-store-a7569d4a546f

import { createStore, createLogger } from 'vuex'
import settings from '@/services/settings'
import user from '@/services/user'
import votes from '@/services/votes'
import elections from '@/services/elections'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
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
