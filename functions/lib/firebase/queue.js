"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Queue = require('firebase-queue');
class FirebaseQueue {
    start(firebaseAdminApp) {
        const ref = firebaseAdminApp.database().ref('queue');
        this.queue = new Queue(ref, function (data, progress, resolve, reject) {
        });
    }
}
exports.default = FirebaseQueue;
//# sourceMappingURL=queue.js.map