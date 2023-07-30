<template>
    <div class="hello">
        <Bubble text class="box bubble bubble-outline">
            Admin
            <div>
                <button
                    class="button"
                    @click="onNewElection"
                >{{ $ui('new-election', 'New Election') }}</button>
            </div>
            <p>&nbsp;</p>
            <table class="table">
                <tr v-for="election in elections" :key="election.id" class="card">
                    <td>
                        <span class="subtitle is-4">{{ election.name }}</span>
                        <br />
                        <span class="is-6">{{ election.region }}</span>
                    </td>
                    <td>
                        <button class="button" @click="onEdit(election)">{{ $ui('edit', 'Edit') }}</button>

                        <button
                            class="button"
                            @click="onDelete(election)"
                        >{{ $ui('delete', 'Delete') }}</button>
                    </td>
                </tr>
            </table>
        </Bubble>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Bubble } from '@/components/ui/all'
import { session } from '@/factory/session'
import { EventHub } from '@/factory/event-hub'
import Election from '@/models/election'
import Auth from '@/mixins/auth'

@Component({
    components: {
        Bubble
    },
    mixins: [Auth]
})
export default class AdminPage extends Vue {
    public data() {
        return {
            elections: []
        }
    }

    public async created() {
        const instance = this as any
        await this.$store.dispatch('elections/getEditable').then(elections => {
            instance.elections = elections
            instance.elections.forEach(async election => {
                election.candidates = await this.$store.dispatch(
                    'elections/getCandidates',
                    { electionId: election.id }
                )
            })
        })
    }

    public onEdit(election: Election) {
        this.$store.dispatch('elections/setCurrent', { election }).then(() => {
            this.$router.push('/admin/election')
        })
    }

    public onDelete(election: Election) {
        this.$store.dispatch('elections/setCurrent', { election })
    }

    public onNewElection() {
        this.$router.push('/admin/election/new')
    }
}
</script>
