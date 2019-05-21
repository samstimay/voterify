<template>
    <div class="hello">
        <Bubble text="" class="bubble-outline" v-if="isLoaded">
            <election-chooser :onChange="onElectionChanged"></election-chooser>
            <p>
                <span>{{ $content('selected', 'Selected') }} : {{ displaySelected() }}</span>
            </p>
            <p>
                <input
                        id="pick-election-button"
                        class="button is-large is-centered"
                        type="button"
                        :value="$ui('select', 'Select')"
                        @click="onSelect"
                />
            </p>
        </Bubble>
    </div>
</template>

<script lang="ts">
    import { Bubble, Button, TextInput, ProgressCounter, ElectionChooser } from "@/components/ui/all";
    import { Component, Prop, Vue } from "vue-property-decorator";
    import Election from "@/models/election";
    import Vote from "@/models/vote";
    import { session } from "@/factory/session";
    import { api } from "@/factory/api";
    import firebaseAuth from "@/factory/firebase-auth";

    @Component({
        components: {
            Bubble,
            Button,
            TextInput,
            ProgressCounter,
            ElectionChooser
        }
    })
    export default class ChosePage extends Vue {
        private _election : Election;

        data() {
            return {
                isLoaded : false as boolean
            }
        }

        created() {
            if (!firebaseAuth.isAuthorized()) this.$router.push("/");
            (this as any).isLoaded = true;
        }

        getSelected() {
            return this._election;
        }

        displaySelected() {
            if(this._election) return this._election.name;
            return '';
        }

        onElectionChanged(election:Election) {
            this._election = election;
        }

        onSelect() {
            const selected = this.getSelected();
            session.setElection(selected);
            this.$router.push("/election");
        }
    }
</script>
