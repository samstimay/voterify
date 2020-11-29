"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Election {
    constructor(name, id, region, date, candidates, active) {
        this.name = name || '';
        this.id = id || '';
        this.region = region || '';
        this.date = date || new Date();
        this.active = active === true;
        this.candidates = [];
        if (candidates) {
            candidates.forEach((candidate) => {
                this.candidates.push(candidate);
            });
        }
    }
    candidateName(candidateId) {
        const result = this.candidates.filter((candidate) => candidate.id === candidateId);
        return result[0] ? result[0].name : '';
    }
    valid() {
        return (this.name.length > 0 && this.id.length > 0 && this.region.length > 0);
    }
}
exports.default = Election;
//# sourceMappingURL=election.js.map