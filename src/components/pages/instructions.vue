<template>
    <div class="hello">
        <Bubble text="" class="bubble-fat bubble-outline">
            <div class="home-bubble-container content">
                <div class="padded static-header">
                    {{ $content('instructions', 'Instructions') }}
                </div>
                <div class="is-2 has-text-left votery-font">
                    {{
                        $content(
                            'instructions-header',
                            'Voterify is a parallel election site using simple cell phone and SMS verification. The goal is to provide an easy way for people to vote in under 60 seconds. And the best part is you get a receipt to track your vote.'
                        )
                    }}
                    <br />
                </div>
                <ol class="generic-ul">
                    <li v-for="line in $lines('instruction-lines')">
                        {{ line }}
                    </li>
                </ol>
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
import Bubble from '@/components/ui/bubble.vue'
import Button from '@/components/ui/button.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { lang, Lang } from '@/factory/lang'

@Component({
    components: {
        Bubble,
        Button
    }
})
export default class InstructionsPage extends Vue {}
</script>
