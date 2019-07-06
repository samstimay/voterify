"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Queue = require('firebase-queue');
class FirebaseQueue {
    start(firebaseAdminApp, workerFn) {
        this.ref = firebaseAdminApp.database().ref('queue');
        this.queue = new Queue(this.ref, function (data, progress, resolve, reject) {
            const result = workerFn(data);
            if (result) {
                resolve();
            }
            else {
                reject();
            }
        });
    }
    push(data) {
        this.ref.push(data);
    }
}
exports.default = FirebaseQueue;
//# sourceMappingURL=queue.js.map