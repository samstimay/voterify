import { api } from '@/factory/api'
import Voter from '@/models/voter'
import FbUser from '@/models/fbUser'

export default {
    get({ commit }) {
        return api.get('getVoter/').then(function(res) {
            if (res.data.exists) {
                const voter = new Voter(res.data.uid, res.data.voterId)
                commit('voter', voter)
                return voter
            } else {
                throw res
            }
        })
    },

    create({ commit }) {
        return api
            .get('createVoter/')
            .then(function(res) {
                if (res.data.exists) {
                    const voter = new Voter(res.data.uid, res.data.voterId)
                    commit('voter', voter)
                    return voter
                } else {
                    throw res
                }
            })
            .catch(this.onCatch)
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
    }
}
