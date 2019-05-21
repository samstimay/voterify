export default class Voter {
    public phone: string;
    public uid: string;
    public voterId: string;

    constructor(phone: string, uid: string, voterId: string) {
        this.phone = phone;
        this.uid = uid;
        this.voterId = voterId;
    }
}
