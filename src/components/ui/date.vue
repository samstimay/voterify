<template>
  <div class="date">{{ dateFormatted }}</div>
</template>

<script lang="ts">
import moment from "moment";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class DateDisplay extends Vue {
    @Prop() private date!: string;

    public data() {
        return {
            dateFormatted: moment(this.date).format("LLLL")
        };
    }
}
</script>