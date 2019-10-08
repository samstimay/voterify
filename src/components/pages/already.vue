<template>
    <div class="hello">
        <Bubble class="bubble-outline">
            <div class="home-bubble-container">
                <p>
                    {{
                        $content(
                            "voted-already",
                            "You have already voted in this election."
                        )
                    }}
                </p>
                <p>
                    {{ electionName() }}
                </p>
                <p>{{ voterId() }}</p>
                <p>
                    <router-link
                        class="button is-centered is-link"
                        :to="{ path: '/track', query: { voterId: voterId() } }"
                    >
                        {{ $ui("track-link", "Track your Vote") }}
                    </router-link>
                </p>
                <div class="padded">
                    <router-link class="button is-centered is-link" to="/">
                        {{ $ui("home", "Home") }}
                    </router-link>
                </div>
            </div>
        </Bubble>
    </div>
</template>

<script lang="ts">
import "@/styles/pages/thanks.scss";
import Bubble from "@/components/ui/bubble.vue";
import { session } from "@/factory/session";
import { Component, Prop, Vue } from "vue-property-decorator";
import firebaseAuth from "@/factory/firebase-auth";

@Component({
    components: {
        Bubble
    }
})
export default class AlreadyPage extends Vue {
    created() {
        if (!firebaseAuth.isAuthorized()) {
            this.$router.push("/");
        }
    }

    voterId() {
        return session.getVoter().voterId;
    }

    electionName() {
        return session.getElection().name;
    }
}
</script>
