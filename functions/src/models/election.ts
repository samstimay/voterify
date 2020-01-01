import Candidate from './candidate'

export default class Election {
    public name: string
    public date: Date
    public id: string
    public region: string
    public candidates: Candidate[]
    public active: Boolean

    constructor(
        name?: string,
        id?: string,
        region?: string,
        date?: Date,
        candidates?: Candidate[],
        active?: Boolean
    ) {
        this.name = name || ''
        this.id = id || ''
        this.region = region || ''
        this.date = date || new Date()
        this.active = active === true

        this.candidates = []
        if (candidates) {
            candidates.forEach(candidate => {
                this.candidates.push(candidate)
            })
        }
    }

    public candidateName(candidateId: string): string {
        const result = this.candidates.filter(
            candidate => candidate.id === candidateId
        )
        return result[0] ? result[0].name : ''
    }

    public valid(): boolean {
        return (
            this.name.length > 0 && this.id.length > 0 && this.region.length > 0
        )
    }
}
