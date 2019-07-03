export default class Vote {
    public electionId: string;
    public candidateId: string;
    public candidate: string;
    public voterId: string;
    public date: Date;

    constructor(
        electionId?: string,
        candidateId?: string,
        candidate?: string,
        voterId?: string,
        date?: Date
    ) {
        this.electionId = electionId || "";
        this.candidateId = candidateId || "";
        this.candidate = candidate || "";
        this.voterId = voterId || "";
        this.date = date || new Date();
    }
}
