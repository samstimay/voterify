import firebaseAuth from '@/factory/firebase-auth'
import { mapState } from 'vuex'
import { EventHub } from '@/factory/event-hub'

// simple module to check if user is authorized
// use this mixin on all private pages requiring login
const Auth = {
    computed: {
        ...mapState('user', ['user', 'voter'])
    },
    async created() {
        if (
            !firebaseAuth.isAuthorized() ||
            !this.voter ||
            !this.voter.voterId
        ) {
            EventHub.$emit('logout')
        }
    }
}

export default Auth
