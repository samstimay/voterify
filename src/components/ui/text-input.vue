<template>
    <div class="control">
        <input
            class="input is-large"
            type="text"
            :placeholder="placeholder"
            v-model="input">
    </div>
</template>

<script lang="ts">
import '../../styles/components/input.scss';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TextInput extends Vue {
    @Prop() private text!: string;
    @Prop() private placeholder!: string;

    public data() {
        return {
            input: this.text,
        };
    }
}
</script>


