import Voter from "@/models/voter";
import Vote from "@/models/vote";
import { session } from "@/factory/session";
import { EventHub } from "@/factory/event-hub";
import { api } from "@/factory/api";
import * as firebase from "firebase";
import User = firebase.User;
import {voterFactory} from '@/factory/voter-factory';
import Election from '@/models/election';

class ElectionFactory {
    private _elections : Election[] = [];

    async getDefaultElection() {
        const elections = await api.getElections();
        return elections[0];
    }

    async getElection() : Promise<Election> {
        let election = session.getElection();
        if(election.id) return election;
        election = await this.getDefaultElection();
        session.setElection(election);
        return election;
    }

    async getElections() : Promise<Election[]> {
        if(this._elections === null || this._elections.length === 0) {
            this._elections = await api.getElections();
        }
        return this._elections;
    }

    async hasVoterVoted() {
        const instance = this;
        const election = await this.getElection();
        const voter = await voterFactory.getVoter();
        return api
            .hasVoterVoted(voter, election)
            .then(function(data) {
                return data;
            })
            .catch(function(data) {
                return false;
            });
    }
}

const electionFactory = new ElectionFactory();

export { electionFactory };
