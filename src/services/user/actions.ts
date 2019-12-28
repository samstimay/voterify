import { api } from '@/factory/api'
import Voter from '@/models/voter'
import FbUser from '@/models/fbUser'
import { onCatch } from '@/plugins/errors'

export default {
    get({ commit }) {
        return api
            .get('getVoter/')
            .then(function(res) {
                if (res.data.exists) {
                    const voter = new Voter(res.data.uid, res.data.voterId)
                    commit('voter', voter)
                    return voter
                } else {
                    throw res
                }
            })
            .catch(onCatch)
    },

    create({ commit }) {
        return api
            .get('createVoter/')
            .then(function(res) {
                if (res.status === 200 && res.data.voterId) {
                    const voter = new Voter(res.data.uid, res.data.voterId)
                    commit('voter', voter)
                    return voter
                } else {
                    throw res
                }
            })
            .catch(onCatch)
    },

    setVoter({ commit }, voter) {
        commit('voter', voter)
    },

    onAuth({ commit }, { user, token }) {
        const fbUser = new FbUser(
            user.phoneNumber,
            token,
            user.refreshToken,
            user.uid
        )
        commit('user', fbUser)
        return fbUser
    },

    getPermissions({ commit }) {
        return api
            .get('permission')
            .then(function(res) {
                if (res.status === 200) {
                    commit('permissions', res.data)
                    return res.data
                } else {
                    throw res
                }
            })
            .catch(onCatch)
    },

    setPermissions({ commit }, { permissions }) {
        commit('permissions', permissions)
    }
}
