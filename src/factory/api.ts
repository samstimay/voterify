import { session } from "@/factory/session";
import axios from "axios";
import FbUser from "@/models/fbUser";
import Voter from "@/models/voter";
import Election from "@/models/election";
import Candidate from "@/models/candidate";
import Vote from "@/models/vote";

class Api {
    private apiPath: string;

    public getApiPath() {
        return this.apiPath;
    }

    private get user(): FbUser {
        return session.getUser();
    }

    private onCatch(res: any): Boolean {
        // tslint:disable-next-line
        console.log("api failed", res);
        return false
    }

    private getHeader(): object {
        const user = this.user;
        if (!user || !user.token) {
            return { headers: { Authorization: "anonymous" } };
        }
        const token = user.token;
        return { headers: { Authorization: "Bearer " + token } };
    }

    private env() {
        return window["VfyEnvironment"] || "development";
    }

    public init() {
        const instance = this
        const fileName = "settings.json";
        return axios
            .get(fileName)
            .then(function(res) {
                instance.apiPath =
                    res.data.apiHost +
                    (res.data.apiPort ? ":" + res.data.apiPort : "") +
                    res.data.apiPath;
            })
            .catch(function(res) {
                // tslint:disable-next-line
                console.log("api init failed", res);
            });
    }

    public getElections(): Promise<Election[]> {
        return axios
            .get(this.apiPath + "elections", this.getHeader())
            .then(function(res) {
                const elections = [];
                res.data.forEach(election => {
                    elections.push(
                        new Election(
                            election.name,
                            election.id,
                            election.region,
                            election.date,
                            []
                        )
                    );
                });
                return elections;
            })
            .catch(function() {
                return [];
            });
    }

    public getDefaultElection(): Promise<Election> {
        return this.getElections().then(function(elections) {
            // todo: smarter default election
            return elections[0];
        });
    }

    public getCandidates(electionId: string): Promise<Candidate[]> {
        return axios
            .get(
                this.apiPath + "candidates/?id=" + electionId,
                this.getHeader()
            )
            .then(function(res) {
                const candidates = [];
                res.data.forEach(candidate => {
                    candidates.push(
                        new Candidate(
                            candidate.name,
                            candidate.id,
                            candidate.party,
                            candidate.electionId
                        )
                    );
                });
                return candidates;
            })
            .catch(function() {
                return [];
            });
    }

    public getVoter(): Promise<Voter> {
        const user = this.user;
        return axios
            .get(this.apiPath + "getVoter/?id=" + user.phone, this.getHeader())
            .then(function(res) {
                if (res.data.error) {
                    return this.onCatch(res);
                }
                if (res.data.exists) {
                    return new Voter(
                        res.data.phone,
                        res.data.uid,
                        res.data.voterId
                    );
                } else {
                    return new Voter(user.phone, user.uid, "");
                }
            })
            .catch(this.onCatch);
    }

    public hasVoterVoted(voter: Voter, election: Election): Promise< Boolean > {
        return axios
            .get(
                this.apiPath +
                    "checkVote/?id=" +
                    election.id +
                    "&voterId=" +
                    voter.voterId,
                this.getHeader()
            )
            .then(function(res) {
                if (res.data.error) {
                    return this.onCatch(res);
                }
                return res.data.exists === true;
            })
            .catch(this.onCatch);
    }

    public createVoter(voter: Voter) {
        return axios
            .get(
                this.apiPath +
                    "createVoter/?id=" +
                    voter.phone +
                    "&uid=" +
                    voter.uid,
                this.getHeader()
            )
            .then(function(res) {
                if (res.data.error) {
                    return this.onCatch(res);
                }
                voter.voterId = res.data.voterId;
                return voter;
            })
            .catch(this.onCatch);
    }

    public createVote(vote: Vote) {
        const post = {
            method: "post",
            url: this.apiPath + "createVote",
            data: vote
        };
        return axios(Object.assign(post, this.getHeader()))
            .then(function(res) {
                if (res.data.error) {
                    return this.onCatch(res);
                }
                return res.data;
            })
            .catch(this.onCatch);
    }

    public trackVote(voterId: string, electionId: string): Promise<Vote> {
        const post = {
            method: "post",
            url: this.apiPath + "trackVote",
            data: { voterId, electionId }
        };
        return axios(Object.assign(post, this.getHeader()))
            .then(function(res) {
                if (res.data.error) {
                    return this.onCatch(res);
                }
                return res.data;
            })
            .catch(this.onCatch);
    }

    public trackPhone(phone: string, electionId: string): Promise<Vote> {
        const post = {
            method: "post",
            url: this.apiPath + "trackPhone",
            data: { phone, electionId }
        };
        return axios(Object.assign(post, this.getHeader()))
            .then(function(res) {
                if (res.data.error) {
                    return this.onCatch(res);
                }
                return res.data;
            })
            .catch(this.onCatch);
    }

    public getVotes(electionId: string): Promise<Vote[]> {
        const user = this.user;
        return axios
            .get(this.apiPath + "getVotes/?id=" + electionId, this.getHeader())
            .then(function(res) {
                const votes = [];
                res.data.forEach(vote => {
                    votes.push(
                        new Vote(
                            electionId,
                            vote.candidateId,
                            vote.candidate,
                            vote.voterId,
                            vote.date
                        )
                    );
                });
                return votes;
            })
            .catch(function() {
                return [];
            });
    }
}

const api = new Api();

export { api };
