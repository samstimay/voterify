<template>
    <div class="hello">
        <Bubble text="Election" class="bubble-outline">
            <div v-show="isLoaded" class="home-bubble-container content">
                {{ election.name }}
                <div class="level">
                    <div class="level-item">
                        <form id="election-form" @submit.prevent="processForm">
                            <table class="table candidates-table">
                                <tr
                                    v-for="(candidate, index) in candidates"
                                    :key="index"
                                    class="candidates"
                                    v-on:click="onClick(candidate.id)"
                                    v-bind:class="{
                                        'is-selected': isChosen(candidate.id)
                                    }"
                                >
                                    <td>
                                        <input
                                            type="radio"
                                            name="candidate"
                                            :value="candidate.id"
                                            :checked="isChosen(candidate.id)"
                                        />
                                    </td>
                                    <td>
                                        <p class="party-name">
                                            {{ candidate.party }}
                                        </p>
                                        <p class="candidate-name">
                                            {{ candidate.name }}
                                        </p>
                                    </td>
                                </tr>
                                <tr style="background:inherit">
                                    <td
                                        colspan="2"
                                        class="is-centered has-text-centered"
                                    >
                                        <input
                                            :disabled="isValid() == false"
                                            class="button is-large is-centered is-link"
                                            type="button"
                                            :value="$ui('select', 'Select')"
                                            v-on:click="processForm"
                                        />
                                    </td>
                                </tr>
                            </table>
                        </form>
                    </div>
                </div>
            </div>
            <div v-show="!isLoaded" class="home-bubble-container content">
                {{ $content("loading-election", "Loading election...") }}
            </div>
            <div class="page-counter">
                <progress-counter
                    currentPage="2"
                    pageCount="4"
                ></progress-counter>
            </div>
        </Bubble>
    </div>
</template>

<script lang="ts">
import "@/styles/global.scss";
import "@/styles/pages/election.scss";
import {
    Bubble,
    Button,
    TextInput,
    ProgressCounter
} from "@/components/ui/all";
import { Component, Prop, Vue } from "vue-property-decorator";
import Candidate from "@/models/candidate";
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
        ProgressCounter
    }
})
export default class ElectionPage extends Vue {
    private candidateId: string = "";

    public data() {
        return {
            candidateId: "",
            isLoaded: false,
            election: {},
            candidates: [],
            isValid() {
                return this.candidateId && this.candidateId.length > 0;
            }
        };
    }

    created() {
        if (!firebaseAuth.isAuthorized()) {
            this.$router.push("/");
        }
        this.loadElection();
    }

    public async loadElection() {
        let election = session.getElection();
        if (!election || !election.name || election.name === "") {
            election = await api.getDefaultElection();
            session.setElection(election);
        }
        this.loadCandidates(election);
    }

    private setElection(election: Election) {
        const instance = this as any;
        instance.isLoaded = true;
        session.setElection(election);
        instance.election = election;
        instance.candidates = election.candidates;
    }

    private async loadCandidates(election: Election) {
        const instance = this as any;
        const candidates = await api.getCandidates(election.id);
        election.candidates = candidates;
        instance.setElection(election);
    }

    public onClick(candidateId: string) {
        this.candidateId = candidateId;
    }

    public isChosen(candidateId: string) {
        return this.candidateId === candidateId;
    }

    public processForm() {
        const election = session.getElection();
        const vote = new Vote(
            election.id,
            this.candidateId,
            election.candidateName(this.candidateId),
            session.getVoter().voterId,
            new Date()
        );
        session.registerVote(vote);
        this.$router.push("/vote");
    }
}
</script>
