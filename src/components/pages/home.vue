<template>
    <div class="hello">
        <Bubble text="" class="bubble-outline">
            <div class="field">
                <div class="control">
                    <vue-tel-input
                        class="phone-number-input"
                        v-model="phoneNumber"
                        @onInput="onInput"
                        :defaultCountry="'us'"
                        :placeholder="$ui('phone-number', 'Phone Number')"
                    ></vue-tel-input>
                </div>
            </div>

            <div class="field is-grouped is-grouped-centered">
                <div class="control" v-show="isValid">
                    <input
                        id="send-sms-button"
                        class="button is-large is-centered"
                        type="button"
                        :value="$ui('send', 'Send')"
                        @click="onClick"
                    />
                </div>
                <div v-show="!isValid" class="is-size-8 is-light is-italic">
                    {{
                        $content(
                            "home-begin",
                            "To begin enter your valid US cell phone number."
                        )
                    }}
                </div>
            </div>

            <div v-show="!isValid">
                <hr />
                <div clas="padded">&nbsp;</div>
                <div class="is-2">
                    <router-link
                        tag="button"
                        to="/manifesto"
                        class="button is-link"
                    >
                        {{ $ui("manifesto-link", "The Voterify Manifesto") }}
                    </router-link>
                </div>
                <div clas="padded">&nbsp;</div>
                <div class="is-2">
                    <router-link
                        tag="button"
                        to="/instructions"
                        class="button is-link"
                    >
                        {{ $ui("instructions-link", "How to use Voterify") }}
                    </router-link>
                </div>
                <div clas="padded">&nbsp;</div>
                <div class="is-2">
                    <router-link
                            tag="button"
                            to="/track"
                            class="button is-link"
                    >
                        {{ $ui("track-link", "Track your Vote") }}
                    </router-link>
                </div>
                <div clas="padded">&nbsp;</div>

                <hr />
                <div class="is-2">
                    {{
                        $content(
                            "home-footer",
                            "A parallel election prototype."
                        )
                    }}
                </div>
            </div>

            <div class="page-counter" v-show="isValid">
                <progress-counter currentPage="0" pageCount="4"></progress-counter>
            </div>
        </Bubble>
    </div>
</template>

<script lang="ts">
import "@/styles/pages/home.scss";
import { EventHub } from "@/factory/event-hub";
import { Bubble, TextInput, ProgressCounter } from "@/components/ui/all";
import { Component, Prop, Vue } from "vue-property-decorator";
import firebase from "@/factory/firebase-provider";
import { constants } from "@/factory/constants";
import firebaseAuth from "@/factory/firebase-auth";

@Component({
    components: {
        Bubble,
        TextInput,
        ProgressCounter
    }
})
export default class HomePage extends Vue {
    @Prop() private msg!: string;
    @Prop() private phone!: string;

    public data() {
        return {
            constants: constants,
            phoneNumber: this.phone,
            isValid: false
        };
    }

    public mounted() {
        const instance = this;
        (window as any).recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            "send-sms-button",
            {
                size: "invisible",
                callback(response) {
                    instance.onClick();
                }
            }
        );
        const phoneInput: Element = document.querySelectorAll('[type="tel"]')[0];
        (phoneInput as any).focus();
    }

    public onInput({ number, isValid, country }) {
        (this as any).isValid = isValid;
    }

    public onClick() {
        const instance = this;
        const phoneNumber = (this as any).phoneNumber;
        const appVerifier = (window as any).recaptchaVerifier;
        return firebaseAuth
            .phone(phoneNumber, appVerifier)
            .then(function() {
                instance.$router.push("/sms");
            })
            .catch(function(error) {
                EventHub.$emit("showPageLoader", {
                    message: error.message,
                    timeout: 2000,
                    callBackFn: instance.onRestartCaptcha
                });
            });
    }

    public onRestartCaptcha() {}
}
</script>
