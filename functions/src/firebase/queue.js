let FirebaseQueueID = 1;
class FirebaseQueue {
    constructor(firebaseAdminApp) {
        this.id = FirebaseQueueID++;
        this.ref = firebaseAdminApp.database().ref('queue');
    }
    push(data) {
        this.ref.push(data);
    }
}
export default FirebaseQueue;
//# sourceMappingURL=queue.js.map