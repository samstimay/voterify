///<reference path='./types/vue-awesome-swiper.d.ts' />
///<reference path='./types/vue-tel-input.d.ts' />

import Vue from "vue";
import App from "./App.vue";
import Router from "./router";
import VueRouter from "vue-router";
import VueTelInput from "vue-tel-input";
import VueAwesomeSwiper from "vue-awesome-swiper";
import "bulma/css/bulma.css";
import "./styles/global.scss";
import firebase from "./factory/firebase-provider";
import Translate from "./plugins/translate";
import { Vuetable, VuetablePagination } from "vuetable-2";
import "@fortawesome/fontawesome-free/css/fontawesome.css";

firebase.auth();

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueTelInput);
Vue.use(VueAwesomeSwiper);
Vue.use(Translate);
Vue.component('vuetable', Vuetable)
Vue.component('vuetable-pagination', VuetablePagination)

window["VfyEnvironment"] = process.env.NODE_ENV;

new Vue({
    router: Router,
    render: h => h(App)
}).$mount("#app");
