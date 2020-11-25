<template>
    <div class="hello">
        <Bubble text class="box bubble bubble-outline">
            <div>
                {{
                    $content(
                        'login-instructions',
                        'Login with one of the providers below.'
                    )
                }}
            </div>
            <GoogleLogin @auth-success="onAuthSuccess" />
        </Bubble>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Bubble } from '@/components/ui/all'
import { session } from '@/factory/session'
import { EventHub } from '@/factory/event-hub'
import firebase from 'firebase'
import GoogleLogin from '@/components/login/google.vue'

@Options({
    components: {
        Bubble,
        GoogleLogin
    }
})
export default class LoginPage extends Vue {
    public async onAuthSuccess() {
        const instance = this
        const voter = session.getVoter()
        if (voter.voterId && voter.uid) {
            return await this.$store.dispatch('user/get').then(function(v) {
                instance.onVoterCreated(v)
            })
        } else {
            this.$store.dispatch('user/create').then(v => {
                if (v.voterId) {
                    instance.onVoterCreated(v)
                } else {
                    instance.onVoterCreateError()
                }
            })
        }
    }

    private onVoterCreated(voter) {
        this.$store.dispatch('user/getPermissions').then(permissions => {
            if (permissions.type !== 'admin') {
                this.$toasted.show('Sorry, you are not a registered user.')
                EventHub.$emit('logout')
                return
            }
            this.$store.dispatch('user/setVoter', voter)
            this.$router.push('/')
        })
    }

    public onVoterCreateError() {
        EventHub.$emit('showPageLoader', {
            message: (this as any).$content(
                'voter-create-failed',
                'Creating a new voter failed...'
            ),
            timeout: 2000
        })
    }
}
</script>
