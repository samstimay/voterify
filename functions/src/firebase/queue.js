"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = FirebaseQueue;
//# sourceMappingURL=queue.js.map