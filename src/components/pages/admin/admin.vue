<template>
    <div class="hello">
        <Bubble text class="box bubble bubble-outline">Admin</Bubble>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Bubble } from '@/components/ui/all'
import { session } from '@/factory/session'
import { EventHub } from '@/factory/event-hub'
import firebase from 'firebase'

@Component({
    components: {
        Bubble
    }
})
export default class AdminPage extends Vue {}
</script>
