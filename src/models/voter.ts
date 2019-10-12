// a voter is simply an association between a firebase UID and a voterId
// firebase stores all the user's information privately
export default class Voter {
    public uid: string;
    public voterId: string;

    constructor(uid: string, voterId: string) {
        this.uid = uid;
        this.voterId = voterId;
    }
}
