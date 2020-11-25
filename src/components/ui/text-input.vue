<template>
    <div class="control">
        <input
            class="input is-large"
            type="text"
            :placeholder="placeholder"
            v-model="input"
        />
    </div>
</template>

<script lang="ts">
import '../../styles/components/input.scss'
import { Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

export default class TextInput extends Vue {
    @Prop() private text!: string
    @Prop() private placeholder!: string

    public data() {
        return {
            input: this.text
        }
    }
}
</script>
