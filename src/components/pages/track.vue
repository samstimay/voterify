<template>
    <div class="hello">
        <Bubble text class="bubble-outline">
            <div class="home-bubble-container content" v-show="isReady">
                <election-chooser
                    :onChange="onElectionChange"
                ></election-chooser>
                {{ $content("track-header", "Track your vote") }}
                <div v-show="!hasTrackingInfo">
                    <div class="field">
                        {{ $content("track-number", "Using tracking number") }}
                        <br />
                        <input
                            id="track-input"
                            class="is-large input is-centered has-text-centered"
                            maxlength="16"
                            v-model="trackingNumber"
                            placeholder="######"
                        />
                        <br />
                        <input
                            class="button is-large is-centered is-link"
                            type="button"
                            :value="$ui('send', 'Send')"
                            @click="onClickTrack"
                        />
                    </div>
                    <!-- <hr/> -->
                    <!--<div class="field">-->
                    <!--{{ $content("track-phone", "Using your phone number") }}-->
                    <!--<br/>-->
                    <!--<vue-tel-input-->
                    <!--class="phone-number-input"-->
                    <!--v-model="trackingPhone"-->
                    <!--:defaultCountry="'us'"-->
                    <!--:placeholder="$ui('phone-number', 'Phone Number')"-->
                    <!--&gt;</vue-tel-input>-->
                    <!--<br/>-->
                    <!--<input-->
                    <!--class="button is-large is-centered is-link"-->
                    <!--type="button"-->
                    <!--:value="$ui('send', 'Send')"-->
                    <!--@click="onClickPhone"-->
                    <!--/>-->
                    <!--</div>-->
                    <div v-show="trackingNotFound">
                        {{
                            $content(
                                "track-not-found",
                                "Your tracking number was not found in the database."
                            )
                        }}
                    </div>
                </div>
                <div v-if="hasTrackingInfo">
                    <div class="field has-text-left">
                        <label>Election</label>
                        <div class="control">{{ electionName }}</div>
                    </div>
                    <div class="field has-text-left">
                        <label>Candidate</label>
                        <div class="control">{{ vote.candidate }}</div>
                    </div>
                    <div class="field has-text-left">
                        <label>Date</label>
                        <div class="control">{{ date() }}</div>
                    </div>
                    <div class="field has-text-left">
                        <label>Voter Id</label>
                        <div class="control">{{ vote.voterId }}</div>
                    </div>
                </div>
                <hr />
                <div class="padded">
                    <router-link class="button is-link" to="/count">
                        {{ $ui("count", "Count all Votes") }}
                    </router-link>
                </div>
                <div class="padded">
                    <router-link class="button is-link" to="/">
                        {{ $ui("home", "Home") }}
                    </router-link>
                </div>
            </div>
        </Bubble>
    </div>
</template>

<script lang="ts">
import {
    Bubble,
    Button,
    TextInput,
    ProgressCounter,
    ElectionChooser
} from "@/components/ui/all";
import { Component, Prop, Vue } from "vue-property-decorator";
import { session } from "@/factory/session";
import { electionFactory } from "@/factory/election-factory";
import { api } from "@/factory/api";
import Vote from "@/models/vote";
import "@/styles/pages/track.scss";
import Election from "@/models/election";
import moment from "moment";

@Component({
    components: {
        Bubble,
        Button,
        TextInput,
        ProgressCounter,
        ElectionChooser
    }
})
export default class TrackPage extends Vue {
    private electionId: string = "";
    private _election: Election;

    data() {
        return {
            isReady: false as boolean,
            trackingNumber: "" as string,
            trackingPhone: "" as string,
            hasTrackingInfo: false as boolean,
            trackingNotFound: false as boolean,
            vote: null as Vote,
            electionName: "" as string
        };
    }

    created() {
        this.getElections();
        const voterId = (this.$route.query as any).voterId;
        if (voterId && voterId.length) {
            (this as any).trackingNumber = voterId;
        }
    }

    date() {
        return moment((this as any).vote.date).format("LLLL");
    }

    onElectionChange(election: Election) {
        this.electionId = election.id;
        this._election = election;
        (this as any).electionName = election.name;
        this.onClickTrack();
    }

    async getElections() {
        const election = await electionFactory.getDefaultElection();
        this.electionId = election.id;
        (this as any).isReady = true;
        (this as any).electionName = election.name;
    }

    async onClickTrack() {
        // todo: validation
        const vote = await api.trackVote(
            (this as any).trackingNumber,
            this.electionId
        );
        if (!vote || !vote.voterId) {
            (this as any).trackingNotFound = true;
            (this as any).hasTrackingInfo = false;
        } else {
            (this as any).trackingNotFound = false;
            (this as any).hasTrackingInfo = true;
            (this as any).vote = vote;
        }
    }

    async onClickPhone() {
        // todo: validation
        const vote = await api.trackPhone(
            (this as any).trackingPhone,
            this.electionId
        );
        if (!vote || !vote.voterId) {
            (this as any).trackingNotFound = true;
            (this as any).hasTrackingInfo = false;
        } else {
            (this as any).trackingNotFound = false;
            (this as any).hasTrackingInfo = true;
            (this as any).vote = vote;
        }
    }
}
</script>
