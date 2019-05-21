<template>
    <div class="box bubble">
        {{ text }}
        <slot></slot>
    </div>
</template>

<script lang="ts">
import "../../styles/components/bubble.scss";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Bubble extends Vue {
    @Prop() private text!: string;
}
</script>
