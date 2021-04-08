<template>
    <div id="app">
        <div v-if="isLoaded">
            <PageLoader></PageLoader>
            <h2 class="has-background-info has-text-centered is-0-fullhd">
                Beta Version of Site
                <a
                    v-if="!isLoggedIn"
                    class="link"
                    @click="$router.push('/login')"
                >
                    {{ $content('login-button', 'Login') }}
                </a>
                <a v-if="isLoggedIn" class="link" @click="onLogout">
                    {{ $ui('logout', 'Logout') }}
                </a>
            </h2>
            <h1 class="votery-font pad-y">
                <router-link to="/">{{ lang('app-name') }}</router-link>
            </h1>
            <router-view></router-view>

            <div class="modal-container">
                <component
                    :is="currentModal"
                    v-bind="currentModalParams"
                ></component>
            </div>

            <swiper class="quotes-slider" :options="swiperOption">
                <swiper-slide
                    class="is-italic"
                    v-for="(quote, index) in quotes"
                    :key="index"
                >
                    {{ quote }}
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>

<script lang="ts">
///<reference path="./types/vue-awesome-swiper.d.ts" />

import 'swiper/dist/css/swiper.css'
import { Component, Vue, Prop } from 'vue-property-decorator'
import PageLoader from './components/ui/page-loader.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { constants } from '@/factory/constants'
import { api } from '@/factory/api'
import firebase from '@/factory/firebase-provider'
import { lang, Lang } from '@/factory/lang'
import { EventHub } from '@/factory/event-hub'
import FbUser from '@/models/fbUser'
import Voter from '@/models/voter'
import { session } from '@/factory/session'
import { mapState } from 'vuex'

@Component({
    components: {
        PageLoader
    },
    computed: {
        ...mapState('user', ['isLoggedIn'])
    }
})
export default class App extends Vue {
    public isLoggedIn!: Boolean

    public data() {
        return {
            isLoaded: false,
            lang: (key: string): string => {
                return lang.content(key, '')
            },
            swiperOption: {
                spaceBetween: 30,
                centeredSlides: true,
                loop: true,
                autoplay: {
                    delay: 10000,
                    disableOnInteraction: false
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                }
            },
            currentModal: null,
            currentModalParams: null
        }
    }

    get quotes(): string[] {
        return lang.lines('quote-lines')
    }

    public created() {
        const instance = this as any
        lang.init().then(function () {
            instance.$store.dispatch('settings/get').then(function () {
                instance.$store.dispatch('elections/get').then(function (data) {
                    instance.isLoaded = true
                })
            })
        })
        EventHub.$on('showModal', function (params) {
            instance.currentModal = params.modal
            instance.currentModalParams = Object.assign(params, {
                showModal: true
            })
        })
        EventHub.$on('logout', this.onLogout)
    }

    public onLogout() {
        firebase
            .auth()
            .signOut()
            .then(() => {
                this.$store.dispatch('user/setPermissions', { permissions: {} })
                this.$store.dispatch('user/setUser', { user: {}, token: '' })
                session.setUser(new FbUser('', '', '', ''))
                session.setVoter(new Voter('', ''))
                this.$router.push('/')
            })
    }
}
</script>
