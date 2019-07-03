<template>
    <div class="hello">
        <Bubble class="bubble-outline">
            <div class="home-bubble-container">
                <div class="field" v-show="isNewVote()">
                    <p>{{ $content("vote-done", "You have Voted!") }}</p>
                    <p>
                        {{
                            $content(
                                "vote-tracking",
                                "Your voting tracking number:"
                            )
                        }}
                    </p>
                    <p>&nbsp;</p>
                    <p class="has-text-weight-bold is-large">
                        {{ trackingNumber() }}
                    </p>
                    <p class="blue-header padded">
                        {{ $content("thank-you", "Thank you") }}
                    </p>
                </div>

                <div class="field" v-show="isAlreadyVoted()">
                    <p>
                        {{
                            $content("voted-already", "You have already voted.")
                        }}
                        &nbsp;
                        {{
                            $content(
                                "vote-tracking",
                                "Your voting tracking number:"
                            )
                        }}
                        &nbsp;
                        {{ voterId }}
                    </p>
                </div>

                <div class="padded">
                    <router-link class="button is-centered is-link" to="/">
                        {{ $ui("home", "Home") }}
                    </router-link>
                </div>

                <div class="page-counter">
                    <progress-counter
                        currentPage="4"
                        pageCount="4"
                    ></progress-counter>
                </div>
            </div>
        </Bubble>
    </div>
</template>

<script lang="ts">
import "@/styles/pages/thanks.scss";
import {
    Bubble,
    Button,
    TextInput,
    ProgressCounter
} from "@/components/ui/all";
import { session } from "@/factory/session";
import { Component, Prop, Vue } from "vue-property-decorator";
import firebaseAuth from "@/factory/firebase-auth";

@Component({
    components: {
        Bubble,
        Button,
        TextInput,
        ProgressCounter
    }
})
export default class ThanksPage extends Vue {
    @Prop() private msg!: string;
    private status: string = null;
    private voterId: string = null;

    data() {
        return {
            voterId: this.voterId
        };
    }

    isNewVote() {
        return this.status === "new-vote";
    }

    isAlreadyVoted() {
        return this.status === "already-voted";
    }

    created() {
        if (!firebaseAuth.isAuthorized()) this.$router.push("/");
        this.status = session.getVoteStatus();
        console.log("this.status ", this.status);
        this.voterId = session.getVoter().voterId;
    }

    public trackingNumber() {
        return session.getVote().voterId;
    }
}
</script>
