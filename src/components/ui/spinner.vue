<template>
    <div class="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</template>

<script lang="ts">
import "../../styles/components/spinner.scss";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Spinner extends Vue {}
</script>
