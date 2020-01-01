export default class Candidate {
    public name: string
    public id: string
    public party: string
    public electionId: string
    public active: Boolean

    constructor(
        name: string,
        id: string,
        party: string,
        electionId: string,
        active: Boolean
    ) {
        this.name = name
        this.id = id
        this.party = party
        this.electionId = electionId
        this.active = active
    }
}
