const Queue = require('firebase-queue');

class FirebaseQueue {

  public ref: any;
  public queue: any;

  public start(firebaseAdminApp: any, workerFn: Function) {
    this.ref = firebaseAdminApp.database().ref('queue');
    this.queue = new Queue(this.ref, function(
        data: String, 
        progress: Function, 
        resolve: Function, 
        reject: Function) {
        
        const result = workerFn(data)
        if(result) {
          resolve()
        } else {
          reject()
        }

    });
  }

  public push(data: Object) {
    this.ref.push(data);
  }
}

export default FirebaseQueue;
