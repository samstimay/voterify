<template>
    <div class="hello">
        <Bubble text class="box bubble bubble-outline">
            Admin
            <div v-for="election in elections" :key="election.id" class="card">
                <div class="card-content">
                    <div class="media-content">
                        <span class="subtitle is-4">{{ election.name }}</span>
                        <span class="is-6">: {{ election.region}}</span>
                    </div>
                </div>
                <footer class="card-footer">
                    <a href="#" class="card-footer-item">Edit</a>
                    <a href="#" class="card-footer-item">Delete</a>
                </footer>
            </div>
        </Bubble>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Bubble } from '@/components/ui/all'
import { session } from '@/factory/session'
import { EventHub } from '@/factory/event-hub'
import Election from '@/models/election'
import firebase from 'firebase'
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

    public created() {
        const instance = this as any
        this.$store.dispatch('elections/getEditable').then(elections => {
            instance.elections = elections
        })
    }
}
</script>
