import Voter from "@/models/voter";
import Vote from "@/models/vote";
import FbUser from "@/models/fbUser";
import Election from "@/models/election";
import * as firebase from "firebase";
import User = firebase.User;
import Candidate from "@/models/candidate";

class Session {
    private voter: Voter;
    private vote: Vote;
    private election: Election;
    private fbUser: FbUser;
    private voteStatus: string;

    constructor() {
        this.voter = new Voter("", "");
        this.vote = new Vote();
        this.election = new Election("", "", "");
        this.fbUser = new FbUser("", "", "", "");
        this.voteStatus = null;
    }

    public registerVote(vote: Vote) {
        this.vote = vote;
    }

    public getVote(): Vote {
        return this.vote;
    }

    public setUser(fbUser: FbUser) {
        this.fbUser = fbUser;
    }

    // TODO: should FbUser be in the app?
    public getUser(): FbUser {
        return this.fbUser;
    }

    public setVoter(voter: Voter) {
        this.voter = voter;
    }

    public getVoter(): Voter {
        return this.voter;
    }

    public setElection(election: Election) {
        const candidates = [];
        election.candidates.forEach(candidate => {
            candidates.push(
                new Candidate(
                    candidate.name,
                    candidate.id,
                    candidate.party,
                    candidate.electionId
                )
            );
        });
        this.election = new Election(
            election.name,
            election.id,
            election.region,
            election.date,
            candidates
        );
    }

    public getElection(): Election {
        return this.election;
    }

    public setVoteStatus(status: string) {
        this.voteStatus = status;
    }

    public getVoteStatus(): string {
        return this.voteStatus;
    }
}

const session = new Session();

export { session };
