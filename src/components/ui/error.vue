<template>
    <article v-if="message" class="message is-danger">
        <div class="message-body">{{ message }}</div>
    </article>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Options({
    props: {
        message: {
            type: String,
            required: true
        }
    }
})
export default class Error extends Vue {}
</script>
