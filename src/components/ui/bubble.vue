<template>
    <div class="box bubble">
        {{ text }}
        <slot></slot>
    </div>
</template>

<script lang="ts">
import '../../styles/components/bubble.scss'
import { Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

export default class Bubble extends Vue {
    @Prop() private text!: string
}
</script>
