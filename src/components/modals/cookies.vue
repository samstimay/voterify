<template>
    <div class="modal is-active" v-show="showModal">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                    {{ $content('cookies', 'Cookies') }}
                </p>
                <button
                    class="delete"
                    aria-label="close"
                    @click="onClickOk"
                ></button>
            </header>
            <section class="modal-card-body">
                {{
                    $content(
                        'cookies-required',
                        'This site requires cookies, please enable them in your browser.'
                    )
                }}
            </section>
            <footer class="modal-card-foot space-evenly">
                <button class="button is-success" @click="onClickOk">
                    {{ $ui('ok', 'OK') }}
                </button>
            </footer>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

export default class CookiesModal extends Vue {
    @Prop() callBackFn: Function
    @Prop() showModal: Boolean

    onClickOk() {
        const instance = this as any
        instance.showModal = false
        if (instance.callBackFn) {
            instance.callBackFn()
        }
    }
}
</script>
