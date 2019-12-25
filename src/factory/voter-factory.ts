import Voter from '@/models/voter'
import Vote from '@/models/vote'
import { session } from '@/factory/session'
import { EventHub } from '@/factory/event-hub'
import { api } from '@/factory/api'
import * as firebase from 'firebase'
import User = firebase.User
import FbUser from '@/models/fbUser'
import firebaseAuth from '@/factory/firebase-auth'

class VoterFactory {
    async getVoter(): Promise<Voter> {
        const voter = session.getVoter()
        if (voter.voterId && voter.uid) {
            return voter
        }
        return await api.getVoter().then(function(v) {
            session.setVoter(v)
            return v
        })
    }

    async onVoterAuth(result) {
        const user = result.user

        const token = await firebaseAuth.getAuthToken()
        const fbUser = new FbUser(
            user.phoneNumber,
            token,
            user.refreshToken,
            user.uid
        )
        session.setUser(fbUser)
        return await api.getVoter().then(function(voter) {
            session.setVoter(voter)
            return voter
        })
    }

    createVoter(successFn, failFn) {
        api.createVoter(session.getVoter())
            .then(voter => {
                session.setVoter(voter)
                successFn()
            })
            .catch(res => {
                failFn()
            })
    }
}

const voterFactory = new VoterFactory()

export { voterFactory }
