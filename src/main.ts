///<reference path='./types/vue-awesome-swiper.d.ts' />
///<reference path='./types/vue-tel-input.d.ts' />

import 'core-js'
import 'core-js/shim'
import '@babel/polyfill'
import { createApp } from 'vue'
import store from './store'
import App from './App.vue'
import Router from './router'
import VueTelInput from 'vue-tel-input'
// import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'bulma/css/bulma.css'
import './styles/global.scss'
import firebase from './factory/firebase-provider'
import Translate from './plugins/translate'
import Vuetable from 'vuetable-2'
import Toasted from 'vue-toasted'
import '@fortawesome/fontawesome-free/css/fontawesome.css'
import { setEventHub } from '@/factory/event-hub'

firebase.auth()

window['VfyEnvironment'] = process.env.NODE_ENV

const app = createApp(App)
    .use(store)
    .use(Router)
    .use(VueTelInput, {
        defaultCountry: 'US',
        enabledFlags: false,
        onlyCountries: ['US']
    })
    // .use(VueAwesomeSwiper)
    .use(Vuetable)
    .use(Translate)
    .use(Toasted, {
        position: 'top-right',
        duration: 2000,
        theme: 'bubble',
        singleton: true
    })
    .mount('#app')

setEventHub(app)

export default app
