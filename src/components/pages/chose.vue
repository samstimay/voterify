<template>
    <div class="hello">
        <Bubble text="" class="bubble-outline">
            <div v-show="!isLoaded">
                <spinner></spinner>
            </div>
            <div v-show="isLoaded">
                <election-chooser
                    :onChange="onElectionChanged"
                    :onLoaded="onElectionLoaded">
                </election-chooser>
                <p>&nbsp;</p>
                <p>
                    <input
                            id="pick-election-button"
                            class="button is-large is-centered"
                            type="button"
                            :value="$ui('select', 'Select')"
                            @click="onSelect"
                    />
                </p>
            </div>
        </Bubble>
    </div>
</template>

<script lang="ts">
    import { Bubble, Button, TextInput, ProgressCounter, ElectionChooser, Spinner } from "@/components/ui/all";
    import { Component, Prop, Vue } from "vue-property-decorator";
    import Election from "@/models/election";
    import Vote from "@/models/vote";
    import { session } from "@/factory/session";
    import { api } from "@/factory/api";
    import firebaseAuth from "@/factory/firebase-auth";
    import { electionFactory } from "@/factory/election-factory";
    import { voterFactory } from "@/factory/voter-factory";

    @Component({
        components: {
            Bubble,
            Button,
            TextInput,
            ProgressCounter,
            ElectionChooser,
            Spinner
        }
    })
    export default class ChosePage extends Vue {
        private _election : Election;

        data() {
            return {
                isLoaded : false as boolean
            }
        }

        async created() {
            const voter = await voterFactory.getVoter();
            if (!firebaseAuth.isAuthorized() || !voter || !voter.voterId) this.$router.push("/");
        }

        getSelected() {
            return this._election;
        }

        displaySelected() {
            if(this._election) return this._election.name;
            return '';
        }

        onElectionLoaded() {
            (this as any).isLoaded = true;
        }

        onElectionChanged(election:Election) {
            this._election = election;
        }

        onSelect() {
            const selected = this.getSelected();
            session.setElection(selected);
            electionFactory.hasVoterVoted().then(voted => {
                if (voted) this.$router.push("/already");
                else this.$router.push("/election");
            });
        }
    }
</script>
