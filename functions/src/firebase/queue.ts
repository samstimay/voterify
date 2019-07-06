const Queue = require('firebase-queue');

class FirebaseQueue {

  public queue: any;

  public start(firebaseAdminApp: any) {
    const ref = firebaseAdminApp.database().ref('queue');
    this.queue = new Queue(ref, function(
        data: String, 
        progress: Function, 
        resolve: Function, 
        reject: Function) {
        
    });
  }
}

export default FirebaseQueue;
