<template>
    <div>
        <div @click="onClick">
            <img
                :src="imageSrc"
                @mouseover="imageSrc = hoverImageSrc"
                @mouseout="imageSrc = normalImageSrc"
            />
        </div>
        <Error :message="errorMessage" />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Error } from '@/components/ui/all'
import auth from 'firebase/auth'

@Component({
    components: {
        Error
    }
})
export default class GoogleLogin extends Vue {
    public data() {
        return {
            imageSrc: '/images/google/btn_google_signin_light_normal_web.png',
            normalImageSrc:
                '/images/google/btn_google_signin_light_normal_web.png',
            hoverImageSrc:
                '/images/google/btn_google_signin_light_focus_web.png',
            errorMessage: ''
        }
    }

    public onClick() {
        
        // TODO: fix auth provider with google
        var provider = new auth.GoogleAuthProvider()

        // const instance = this as any
        //     auth
        
        //     .signInWithPopup(this.provider)
        //     .then(async function(result) {
        //         const token = await firebaseAuth.getAuthToken()
        //         const fbUser = await instance.$store.dispatch('user/setUser', {
        //             user: result.user,
        //             token
        //         })
        //         instance.$emit('auth-success')
        //     })
        //     .catch(function(error) {
        //         instance.errorMessage = error.message
        //     })
    }
}
</script>
