<template>
  <div class="hello">
    <div class="padded">
      <router-link class="button is-link" to="/">{{ $ui("home", "Home") }}</router-link>
    </div>
    <div class="box bubble-outline votes-table-container has-text-centered">
      <election-chooser :onChange="onChangeElection"></election-chooser>
      <div class="home-bubble-container content" v-show="isReady">
        {{ $content("count-header", "Vote Counts") }}
        <div class="padded" v-if="isReady">
          <vuetable-pagination
            @vuetable-pagination:change-page="onChangePage"
            ref="pagination"
          ></vuetable-pagination>
          <vuetable
            :api-url="apiUrl"
            :css="css.table"
            :fields="fields"
            :http-options="httpOptions"
            @vuetable:pagination-data="onPaginationData"
            data-path="mydata"
            pagination-path="pagination"
            ref="vuetable"
          ></vuetable>
        </div>
        <hr>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
    Bubble,
    Button,
    TextInput,
    ProgressCounter,
    DateDisplay,
    ElectionChooser
} from "@/components/ui/all";
import { Component, Prop, Vue } from "vue-property-decorator";
import { session } from "@/factory/session";
import { electionFactory } from "@/factory/election-factory";
import { EventHub } from "@/factory/event-hub";
import { api } from "@/factory/api";
import Vote from "@/models/vote";
import Election from "@/models/election";
import Candidate from "@/models/candidate";
import moment from "moment";
import "@/styles/pages/count.scss";
import CssForBootstrap4 from '@/components/ui/VuetableCss.js'

@Component({
    components: {
        ElectionChooser,
        Bubble,
        Button,
        TextInput,
        ProgressCounter,
        DateDisplay
    }
})
export default class CountPage extends Vue {
    private electionId: string = "";
    private prevElectionId: string = "";

    data() {
        return {
            isReady: false as boolean,
            electionName: "" as string,
            election: null as Election,
            css: CssForBootstrap4
        };
    }

    created() {
        EventHub.$emit("showPageLoader", {
            message: (this as any).$ui("loading", "Loading...")
        });
        this.load();
    }

    onChangeElection(election:Election) {
        this.electionId = election.id;
        (this as any).election = election;
        (this as any).electionName = election.name;
        (this as any).isReady = true;
        // prevent double loading
        if(this.prevElectionId !== this.electionId) {
            this.prevElectionId = this.electionId;
            const vuetable = ((this.$refs.vuetable) as any);
            if(vuetable) vuetable.refresh();
        }
    }

    get httpOptions() {
        return {
            headers: {
                Authorization: "public",
                "Access-Control-Allow-Origin": api.getApiPath()
            }
        };
    }

    get apiUrl() {
        return api.getApiPath() + "getVotesTable?id=" + this.electionId;
    }

    get fields() {
        return [
            {
                name: "candidate",
                title: (this as any).$content("candidate", "Candidate")
            },
            {
                name: "voterId",
                title: (this as any).$content("voterId", "Voter ID")
            },
            { name: "date", title: (this as any).$content("date", "Date") }
        ];
    }

    transform(data) {
        var transformed = {};

        (transformed as any).pagination = {
            total: data.total,
            per_page: data.per_page,
            current_page: data.current_page,
            last_page: data.last_page,
            next_page_url: data.next_page_url,
            prev_page_url: data.prev_page_url,
            from: data.from,
            to: data.to
        };

        (transformed as any).mydata = [];

        for (var i = 0; i < data.data.length; i++) {
            var item = data.data[i];
            (transformed as any).mydata.push({
                candidate: item.candidate,
                voterId: item.voterId,
                date: moment(item.date).format("LLLL")
            });
        }

        return transformed;
    }

    onPaginationData(paginationData) {
        ((this.$refs.pagination) as any).setPaginationData(paginationData)
    }

    onChangePage(page) {
        ((this.$refs.vuetable) as any).changePage(page)
    }

    async load() {
        this.$nextTick(function() {
            EventHub.$emit("hidePageLoader");
        });
    }
}
</script>
