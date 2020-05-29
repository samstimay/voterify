<template>
    <div class="hello">
        <Bubble text="" class="bubble-fat bubble-outline">
            <div class="home-bubble-container content">
                <div class="padded static-header">
                    {{ $content('manifesto', 'Manifesto') }}
                </div>
                <ul class="generic-ul">
                    <li
                        v-for="line in $lines('manifesto-lines')"
                        class="is-medium"
                    >
                        {{ line }}
                    </li>
                </ul>
                <div class="padded">
                    <router-link class="button is-link" to="/">
                        {{ $ui('home', 'Home') }}
                    </router-link>
                </div>
            </div>
        </Bubble>
    </div>
</template>

<script lang="ts">
import '@/styles/global.scss'
import Bubble from '@/components/ui/bubble.vue'
import Button from '@/components/ui/button.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
    components: {
        Bubble,
        Button
    }
})
export default class ManifestoPage extends Vue {}
</script>
