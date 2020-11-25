<template>
    <Bubble text class="box bubble bubble-outline">
        <div class="field">
            <label class="label">ID</label>
            <div class="control">
                <input
                    class="input"
                    type="text"
                    v-model="id"
                    :disabled="isEditMode"
                />
            </div>
        </div>
        <div class="field">
            <label class="label">Name</label>
            <div class="control">
                <input class="input" type="text" v-model="name" />
            </div>
        </div>
        <div class="field">
            <label class="label">Region</label>
            <div class="control">
                <input class="input" type="text" v-model="region" />
            </div>
        </div>
        <div class="field">
            <label class="label">Candidates</label>
            <button class="button" @click="onAddCandidate">
                {{ $ui('add-candidate', 'Add Candidate') }}
            </button>
            <div class="control">
                <div
                    class="card"
                    v-for="candidate in candidates"
                    :key="candidate.id"
                >
                    <div class="card-footer">
                        <div class="card-footer-item">{{ candidate.name }}</div>
                        <div class="card-footer-item">
                            <button
                                class="button"
                                @click="onEditCandidate(candidate)"
                            >
                                {{ $ui('edit', 'Edit') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="field">
            <label class="label">Active</label>
            <div class="field">
                <input
                    class="switch"
                    type="checkbox"
                    name="switchExample"
                    :checked="active ? 'checked' : ''"
                    v-model="active"
                />
            </div>
        </div>
        <div class="field">
            <div class="columns is-multiline is-mobile">
                <div class="column is-one-quarter">
                    <button class="button" @click="onSave">
                        {{ $ui('save', 'Save') }}
                    </button>
                </div>
                <div class="column is-one-quarter">
                    <button class="button" @click="$router.push('/admin')">
                        {{ $ui('back', 'Back') }}
                    </button>
                </div>
            </div>
        </div>
    </Bubble>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { session } from '@/factory/session'
import { Bubble } from '@/components/ui/all'
import { EventHub } from '@/factory/event-hub'
import Election from '@/models/election'
import firebase from 'firebase'
import Auth from '@/mixins/auth'

import { mapState } from 'vuex'

@Options({
    components: {
        Bubble
    },
    computed: {
        ...mapState('elections', ['currentElection'])
    },
    mixins: [Auth]
})
export default class EditElectionPage extends Vue {
    public currentElection!: Election

    public data() {
        return {
            name: '',
            region: '',
            id: '',
            active: true,
            isEditMode: false,
            candidates: []
        }
    }

    public async mounted() {
        const instance = this as any
        instance.isEditMode = this.$route.name === 'edit-election'
        if (instance.isEditMode) {
            instance.id = instance.currentElection.id
            instance.name = instance.currentElection.name
            instance.region = instance.currentElection.region
            instance.active = instance.currentElection.active
            instance.candidates = await this.$store.dispatch(
                'elections/getCandidates',
                { electionId: instance.currentElection.id }
            )
        } else {
            instance.id = ''
            instance.name = ''
            instance.region = ''
            instance.active = true
            instance.candidates = []
        }
    }

    public onSave() {
        const instance = this as any
        const election = new Election(
            instance.name,
            instance.id,
            instance.region,
            instance.isEditMode ? instance.currentElection.date : new Date(),
            instance.candidates,
            instance.active
        )
        this.$store.dispatch('elections/save', { election }).then(() => {
            this.$toasted.show('Saved')
        })
    }

    public onAddCandidate() {
        this.$router.push('/admin/candidate/new')
    }

    public onEditCandidate(candidate) {
        this.$store
            .dispatch('elections/setCurrentCandidate', { candidate })
            .then(() => {
                this.$router.push('/admin/candidate')
            })
    }
}
</script>
