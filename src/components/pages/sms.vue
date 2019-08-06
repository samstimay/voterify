<template>
    <div class="hello">
        <Bubble text="Verifying your number..." class="bubble-outline">
            <div class="field">
                <div class="control">
                    <input
                        id="sms-input"
                        type="tel"
                        class="is-large input is-centered has-text-centered"
                        maxlength="6"
                        v-model="sms"
                        @input="onChange"
                        placeholder="######"
                        autocomplete="off"
                    />
                </div>
            </div>

            <div class="field is-grouped is-grouped-centered">
                <div class="control">
                    <input
                        class="button is-large is-centered is-link"
                        type="button"
                        :disabled="!isValid"
                        :value="$ui('send', 'Send')"
                        @click="onClick"
                    />
                </div>
            </div>
            <div
                class="field is-grouped is-grouped-multiline"
                v-show="!isValid"
            >
                <div class="is-size-8 is-light is-italic">
                    <p>
                        {{
                            $content(
                                "sms-instructions",
                                "Enter your 6 digit SMS code."
                            )
                        }}
                    </p>
                    <p>
                        {{
                            $content(
                                "sms-didnot",
                                "If you did not receive a code."
                            )
                        }}
                    </p>
                </div>
            </div>
            <div
                class="field is-grouped is-grouped-multiline"
                v-show="!isValid"
            >
                <div class="is-size-8 is-light is-italic">
                    <hr />
                    <p>
                        Having trouble?
                        <input
                            class="button is-centered is-link"
                            type="button"
                            :value="newSmsText"
                            @click="onRestartSms"
                        />
                    </p>
                </div>
            </div>
            <div class="field is-grouped has-text-left">
                <div class="is-size-8 is-light is-italic" v-show="tries > 0">
                    <p>{{ $content("sms-incorrect", "Incorrect SMS code") }}</p>
                    <p>
                        {{
                            $content(
                                "sms-tries",
                                "You have %% chances to enter the correct SMS code.",
                                maxTries - tries
                            )
                        }}
                    </p>
                    <p>
                        <i>
                            {{
                                $content(
                                    "sms-didyou",
                                    "Did you receive a text message on your cell phone?"
                                )
                            }}
                        </i>
                    </p>
                </div>
            </div>
            <div class="page-counter">
                <progress-counter
                    currentPage="1"
                    pageCount="4"
                ></progress-counter>
            </div>
        </Bubble>
    </div>
</template>

<script lang="ts">
import "@/styles/pages/home.scss";
import { EventHub } from "@/factory/event-hub";
import {
    Bubble,
    Button,
    TextInput,
    ProgressCounter
} from "@/components/ui/all";
import { Component, Prop, Vue } from "vue-property-decorator";
import { voterFactory } from "@/factory/voter-factory";
import { electionFactory } from "@/factory/election-factory";
import { session } from "@/factory/session";
import { api } from "@/factory/api";
import firebaseAuth from "@/factory/firebase-auth";
import "bulma-pageloader";

@Component({
    components: {
        Bubble,
        Button,
        TextInput,
        ProgressCounter
    }
})
export default class SMSPage extends Vue {
    private isPhoneRegistered: boolean = false;

    public data() {
        return {
            sms: "",
            newSmsText: (this as any).$ui(
                "sms-new-code",
                "I need a new SMS Code"
            ),
            tries: 0,
            maxTries: 5,
            isValid: false
        };
    }

    public created() {
        EventHub.$emit("showPageLoader", {
            message: (this as any).$content(
                "sms-sending",
                "Sending you an SMS code, check your text messages..."
            ),
            timeout: 2000,
            callBackFn: this.onPageReady
        });
    }

    public onPageReady() {
        document.getElementById("sms-input").focus();
    }

    public onChange() {
        (this as any).isValid = (this as any).sms.match(/\b\d{6}\b/g);
    }

    public onClick() {
        const instance = this;
        const code = (this as any).sms;
        const confirmation = firebaseAuth.confirmation;

        if (!confirmation) {
            console.log("Missing firebase confirmation");
            instance.onPhoneError();
        }

        confirmation
            .confirm(code)
            .then(data => {
                EventHub.$emit("showPageLoader", {
                    message: (instance as any).$content(
                        "sms-confirmed",
                        "SMS confirmed, checking your voter status..."
                    )
                });

                voterFactory
                    .onVoterAuth(data)
                    .then(() => {
                        instance.onPhoneCheck();
                    })
                    .catch(() => {
                        console.log("onVoterAuth failed");
                        instance.onPhoneError();
                    });
            })
            .catch(instance.retrySms);
    }

    public retrySms(data: any) {
        const instance = this as any;
        instance.sms = "";
        instance.tries++;
        if (instance.tries >= instance.maxTries) instance.onRestartSms();
    }

    public async onRestartSms() {
        await firebaseAuth.signOut();
        (window as any).recaptchaVerifier.reset();
        this.$router.push("/");
    }

    public async onPhoneCheck() {
        EventHub.$emit("hidePageLoader");
        const voter = await voterFactory.getVoter(),
            instance = this;
        // voter exists, have they voted?
        if (voter.voterId && voter.uid) {
            this.$router.push("/chose");
        }
        // voter does not exist, create them
        else {
            voterFactory.createVoter(
                function() {
                    instance.$router.push("/chose");
                },
                function() {
                    console.log("Create voter failed.");
                    instance.onVoterCreateError();
                }
            );
        }
    }
    public onPhoneError() {
        EventHub.$emit("showPageLoader", {
            message: (this as any).$content(
                "sms-restart",
                "Need to restart SMS process..."
            ),
            timeout: 2000,
            callBackFn: this.onRestartSms
        });
    }
    public onVoterCreateError() {
        EventHub.$emit("showPageLoader", {
            message: (this as any).$content(
                "voter-create-failed",
                "Creating a new voter failed..."
            ),
            timeout: 2000,
            callBackFn: this.onRestartSms
        });
    }
}
</script>
