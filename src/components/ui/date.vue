<template>
    <div class="date">{{ dateFormatted }}</div>
</template>

<script lang="ts">
import moment from 'moment'
import { Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

export default class DateDisplay extends Vue {
    @Prop() private date!: string

    public data() {
        return {
            dateFormatted: moment(this.date).format('LLLL')
        }
    }
}
</script>
