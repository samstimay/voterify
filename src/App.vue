<template>
    <div id="app">
        <div v-if="isLoaded">
            <PageLoader></PageLoader>
            <h2 class="has-background-info has-text-centered is-0-fullhd">
                Beta Version of Site
            </h2>
            <h1>{{ lang("app-name") }}</h1>
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

import "./styles/global.scss";
import "swiper/dist/css/swiper.css";
import { Component, Vue, Prop } from "vue-property-decorator";
import PageLoader from "./components/ui/page-loader.vue";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { constants } from "@/factory/constants";
import { api } from "@/factory/api";
import { lang, Lang } from "@/factory/lang";
import { EventHub } from "@/factory/event-hub";

@Component({
    components: {
        PageLoader
    }
})
export default class App extends Vue {
    public data() {
        return {
            isLoaded: false,
            lang: (key: string): string => {
                return lang.content(key, "");
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
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                }
            },
            currentModal: null,
            currentModalParams: null
        };
    }

    get quotes(): string[] {
        return lang.lines("quote-lines");
    }

    public created() {
        const instance = this as any;
        lang.init().then(function() {
            api.init().then(function() {
                api.getElections().then(function(data) {
                    (instance as any).isLoaded = true;
                });
            });
        });
        EventHub.$on("showModal", function(params) {
            instance.currentModal = params.modal;
            instance.currentModalParams = Object.assign(params, {
                showModal: true
            });
        });
    }
}
</script>
