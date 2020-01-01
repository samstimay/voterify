<template>
    <div class="hello">
        <Bubble text class="bubble-outline">
            <div v-show="!isLoaded">
                <spinner></spinner>
            </div>
            <div v-show="isLoaded">
                <election-chooser :onChange="onElectionChanged" :onLoaded="onElectionLoaded"></election-chooser>
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
import {
    Bubble,
    Button,
    TextInput,
    ProgressCounter,
    ElectionChooser,
    Spinner
} from '@/components/ui/all'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Election from '@/models/election'
import Vote from '@/models/vote'
import { session } from '@/factory/session'
import { api } from '@/factory/api'
import firebaseAuth from '@/factory/firebase-auth'

import auth from '@/mixins/auth'

@Component({
    components: {
        Bubble,
        Button,
        TextInput,
        ProgressCounter,
        ElectionChooser,
        Spinner
    },
    mixins: [auth]
})
export default class ChosePage extends Vue {
    private _election: Election

    data() {
        return {
            isLoaded: false as boolean
        }
    }

    getSelected() {
        return this._election
    }

    displaySelected() {
        if (this._election) {
            return this._election.name
        }
        return ''
    }

    onElectionLoaded() {
        ;(this as any).isLoaded = true
    }

    onElectionChanged(election: Election) {
        this._election = election
    }

    public onSelect() {
        const selected = this.getSelected()
        const voter = session.getVoter()
        const electionId = selected.id
        session.setElection(selected)
        this.$store
            .dispatch('elections/hasVoterVoted', { voter, electionId })
            .then(voted => {
                if (voted) {
                    this.$router.push('/already')
                } else {
                    this.$router.push('/election')
                }
            })
    }
}
</script>
