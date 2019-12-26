<template>
    <div class="hello">
        <Bubble text class="bubble-outline">
            <div class="home-bubble-container content">
                {{ $content("vote-header", "Vote for your candidate.") }}
                <div class="blue-header is-large is-bold padded">{{ vote.candidate }}</div>
                <div>
                    <input
                        class="button is-large is-centered is-link"
                        type="button"
                        :value="$ui('vote', 'Vote')"
                        @click="onClickVote"
                    />
                </div>
                <div class="padded">&nbsp;</div>
                <hr />
                <div>
                    <p>{{ $content("vote-changed", "I changed my mind") }}</p>
                    <input
                        class="button is-centered is-link"
                        type="button"
                        :value="$ui('back-election', 'Back to Election')"
                        @click="onClickBack"
                    />
                </div>
            </div>
            <div class="page-counter">
                <progress-counter currentPage="3" pageCount="4"></progress-counter>
            </div>
        </Bubble>
        <div class="modal is-active" v-show="showModal">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">{{ $content("confirmation", "Confirmation") }}</p>
                    <button class="delete" aria-label="close"></button>
                </header>
                <section class="modal-card-body">
                    {{
                    $content(
                    "vote-areyousure",
                    "Are you sure you wish to vote for %%?",
                    vote.candidate
                    )
                    }}
                </section>
                <footer class="modal-card-foot space-evenly">
                    <button class="button is-success" @click="onClickYes">{{ $ui("yes", "YES") }}</button>
                    <button class="button" @click="onClickNo">{{ $ui("no", "NO") }}</button>
                </footer>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import '@/styles/pages/vote.scss'
import { Bubble, Button, TextInput, ProgressCounter } from '@/components/ui/all'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { session } from '@/factory/session'
import { api } from '@/factory/api'
import auth from '@/mixins/auth'

@Component({
    components: {
        Bubble,
        Button,
        TextInput,
        ProgressCounter
    },
    mixins: [auth]
})
export default class VotePage extends Vue {
    @Prop() private msg!: string

    data() {
        return {
            showModal: false
        }
    }

    get vote() {
        return session.getVote()
    }

    onClickVote() {
        if ((this as any).showModal === false) {
            ;(this as any).showModal = true
        }
    }
    onClickBack() {
        this.$router.push('/election')
    }
    onClickNo() {
        ;(this as any).showModal = false
    }
    onClickYes() {
        const vote = session.getVote()
        this.$store.dispatch('votes/create', vote).then(data => {
            session.setVoteStatus((data as any).status)
            this.$router.push('/thanks')
        })
    }
}
</script>
