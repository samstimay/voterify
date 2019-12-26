<template>
    <article v-if="message" class="message is-danger">
        <div class="message-body">{{message}}</div>
    </article>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
    props: {
        message: {
            type: String,
            required: true
        }
    }
})
export default class Error extends Vue {}
</script>
