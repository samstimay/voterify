<template>
    <Bubble text class="box bubble bubble-outline">
        <div class="field">
            <label class="label">Election ID</label>
            <div class="control">{{ currentElection.id }}</div>
        </div>
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
            <label class="label">Party</label>
            <div class="control">
                <input class="input" type="text" v-model="party" />
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
                    <button
                        class="button"
                        @click="$router.push('/admin/election')"
                    >
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
import Candidate from '../../../models/candidate'

@Options({
    components: {
        Bubble
    },
    computed: {
        ...mapState('elections', ['currentElection', 'currentCandidate'])
    },
    mixins: [Auth]
})
export default class EditCandidatePage extends Vue {
    public currentElection!: Election
    public currentCandidate!: Candidate

    public data() {
        return {
            name: '',
            party: '',
            id: '',
            active: true,
            isEditMode: false
        }
    }

    public async mounted() {
        const me = this as any
        me.isEditMode = this.$route.name === 'edit-candidate'
        if (me.isEditMode) {
            me.id = this.currentCandidate.id
            me.name = this.currentCandidate.name
            me.party = this.currentCandidate.party
            me.active = this.currentCandidate.active
        } else {
            me.id = ''
            me.name = ''
            me.party = ''
            me.active = true
        }
    }

    public async onSave() {
        const me = this as any
        const candidate = new Candidate(
            me.name,
            me.id,
            me.party,
            this.currentElection.id,
            me.active
        )

        if (me.isEditMode) {
            await this.$store.dispatch('elections/editCandidate', {
                candidate
            })
        } else {
            await this.$store.dispatch('elections/addCandidate', {
                candidate
            })
        }

        this.$store
            .dispatch('elections/save', { election: this.currentElection })
            .then(() => {
                this.$toasted.show('Saved')
            })
    }
}
</script>
