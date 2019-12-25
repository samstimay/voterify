export default class Candidate {
    public name: string
    public id: string
    public party: string
    public electionId: string

    constructor(name: string, id: string, party: string, electionId: string) {
        this.name = name
        this.id = id
        this.party = party
        this.electionId = electionId
    }
}
