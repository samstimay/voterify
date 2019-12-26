<template>
    <div class="hello">
        <div class="padded">
            <router-link class="button is-link" to="/">{{ $ui("home", "Home") }}</router-link>
        </div>
        <div class="box bubble-outline votes-table-container has-text-centered">
            <election-chooser :onChange="onChangeElection"></election-chooser>
            <div v-show="!isReady">
                <spinner></spinner>
            </div>
            <div class="home-bubble-container content" v-show="isReady">
                {{ $content("count-header", "Vote Counts") }}
                <div class="padded" v-if="isMounted" v-show="isReady">
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
                        @vuetable:load-success="onTableLoaded"
                        data-path="mydata"
                        pagination-path="pagination"
                        ref="vuetable"
                    ></vuetable>
                </div>
                <hr />
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
    ElectionChooser,
    Spinner
} from '@/components/ui/all'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { session } from '@/factory/session'
import { EventHub } from '@/factory/event-hub'
import { api } from '@/factory/api'
import Vote from '@/models/vote'
import Election from '@/models/election'
import Candidate from '@/models/candidate'
import moment from 'moment'
import '@/styles/pages/count.scss'
import CssForBootstrap4 from '@/components/ui/VuetableCss.js'
import { Vuetable, VuetablePagination } from 'vuetable-2'

@Component({
    components: {
        ElectionChooser,
        Bubble,
        Button,
        TextInput,
        ProgressCounter,
        DateDisplay,
        Spinner
    }
})
export default class CountPage extends Vue {
    private electionId: string = ''
    private prevElectionId: string = ''

    data() {
        return {
            isReady: false as boolean,
            isMounted: false as boolean,
            electionName: '' as string,
            election: null as Election,
            css: CssForBootstrap4
        }
    }

    created() {
        EventHub.$emit('showPageLoader', {
            message: (this as any).$ui('loading', 'Loading...')
        })
        this.load()
    }

    onChangeElection(election: Election) {
        ;(this as any).isMounted = true
        ;(this as any).isReady = false
        this.electionId = election.id
        ;(this as any).election = election
        ;(this as any).electionName = election.name
        // prevent double loading
        if (this.prevElectionId !== this.electionId) {
            this.prevElectionId = this.electionId
            const vuetable = this.$refs.vuetable as Vuetable
            if (vuetable) {
                vuetable.apiUrl = this.apiUrl
                vuetable.refresh()
            }
        }
    }

    get httpOptions() {
        return {
            headers: {
                // tslint:disable-next-line
                Authorization: 'public',
                'Access-Control-Allow-Origin': api.path()
            }
        }
    }

    get apiUrl() {
        return api.path() + 'getVotesTable?id=' + this.electionId
    }

    get fields() {
        return [
            {
                name: 'candidate',
                title: (this as any).$content('candidate', 'Candidate')
            },
            {
                name: 'voterId',
                title: (this as any).$content('voterId', 'Voter ID')
            },
            { name: 'date', title: (this as any).$content('date', 'Date') }
        ]
    }

    transform(data) {
        const transformed = {}
        ;(transformed as any).pagination = {
            total: data.total,
            per_page: data.per_page,
            current_page: data.current_page,
            last_page: data.last_page,
            next_page_url: data.next_page_url,
            prev_page_url: data.prev_page_url,
            from: data.from,
            to: data.to
        }
        ;(transformed as any).mydata = []

        for (let i = 0; i < data.data.length; i++) {
            const item = data.data[i]
            ;(transformed as any).mydata.push({
                candidate: item.candidate,
                voterId: item.voterId,
                date: moment(item.date).format('LLLL')
            })
        }

        return transformed
    }

    onPaginationData(paginationData) {
        ;(this.$refs.pagination as any).setPaginationData(paginationData)
    }

    onTableLoaded() {
        ;(this as any).isReady = true
    }

    onChangePage(page) {
        ;(this as any).isReady = false
        ;(this.$refs.vuetable as any).changePage(page)
    }

    async load() {
        this.$nextTick(function() {
            EventHub.$emit('hidePageLoader')
        })
    }
}
</script>
