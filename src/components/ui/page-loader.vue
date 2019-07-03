<template>
    <div class="pageloader" v-bind:class="{ 'is-active': active }">
        <span class="title" v-html="text"></span>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { EventHub } from "../../factory/event-hub";
import "@/styles/components/page-loader.scss";
import "bulma-pageloader";

@Component({})
export default class PageLoader extends Vue {
    private message: String = "";
    private isActive: Boolean = false;
    private callBackFn: Function = null;

    public created() {
        EventHub.$on("showPageLoader", this.showPageLoader);
        EventHub.$on("hidePageLoader", this.hidePageLoader);
    }

    get text(): String {
        return this.message;
    }
    get active(): Boolean {
        return this.isActive;
    }

    public showPageLoader(args: any) {
        this.message = args.message || "Loading...";

        this.isActive = true;
        this.callBackFn = args.callBackFn;

        if (args.timeout) {
            setTimeout(this.hidePageLoader, args.timeout);
        }
    }

    public hidePageLoader() {
        this.isActive = false;
        if (this.callBackFn) this.callBackFn();
    }
}
</script>
