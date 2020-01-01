<template>
    <div v-if="isLoaded">
        <div class="is-size-8 is-light is-italic">
            {{ $content('chose-election', 'Chose your election.') }}
        </div>
        <div class="drop-down is-fullwidth">
            <select
                class="is-fullwidth"
                v-model="selected"
                @change="onChangeElection($event)"
            >
                <option :value="option.value" v-for="option in electionNames()">
                    {{ option.label }}
                </option>
            </select>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Election from '@/models/election'
import { mapState } from 'vuex'

@Component({
    computed: mapState('elections', ['currentElection', 'elections'])
})
export default class ElectionChooser extends Vue {
    public elections!: Election[]
    public currentElection!: Election
    @Prop() onChange: Function
    @Prop() onLoaded?: Function

    data() {
        return {
            isLoaded: false as boolean,
            selected: null as string
        }
    }

    created() {
        this.load()
    }

    async load() {
        const instance = this as any
        instance.selected = this.elections[0].id
        instance.isLoaded = true
        if (instance.onLoaded) {
            instance.onLoaded()
        }
        this.onChange(this.elections[0])
    }

    electionNames() {
        return this.elections
            .filter((x: Election) => {
                return x.active
            })
            .map((x: Election) => {
                return { label: x.name, value: x.id }
            })
    }

    onChangeElection(evt) {
        const id = (this as any).selected
        const election = this.elections.filter(x => {
            return x.id === id
        })
        this.onChange(election[0])
    }
}
</script>
