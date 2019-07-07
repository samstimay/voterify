const Queue = require('firebase-queue');
import { logger } from "../log";

let FirebaseQueueID = 1;

class FirebaseQueue {

  public id: Number;
  public ref: any;
  public queue: any;
  public workerFn : any;

  constructor() {
    this.id = FirebaseQueueID++;
  }

  public async worker(
    data: string, 
    progress: Function, 
    resolve: Function, 
    reject: Function) {
    
    logger.message("FirebaseQueue called with", data);

    const result = await this.workerFn(data);
    
    if(result) {
      resolve(data)
    } else {
      reject("FirebaseQueue rejected " + data)
    }
}

  public start(firebaseAdminApp: any, workerFn: Function) {
    this.workerFn = workerFn;
    this.ref = firebaseAdminApp.database().ref('queue');
    const options = {
      'specId': 'spec_' + this.id,
      'numWorkers': 1,
      'sanitize': false,
      'suppressStack': true
    };
    this.queue = new Queue(this.ref, options, this.worker);
    logger.message("FirebaseQueue started " + this.id);
  }

  public push(data: Object) {
    this.ref.push(data);
  }

  public shutdown() {
    logger.message("Shutting down FirebaseQueue " + this.id)
    return this.queue.shutdown();
  }
}

export default FirebaseQueue;
