/* eslint-disable promise/always-return */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable promise/catch-or-return */
var Queue = require('firebase-queue'),
    Firebase = require('firebase');
    
var firebase = Firebase.initializeApp({
    credential: "../secrets/voterify-7637e-firebase-adminsdk-nal41-d99d35a65e.json",
    databaseURL: "https://voterify-7637e.firebaseio.com"
});

// TODO: this is not reading from the Queue yet.  It is writing to the queue, just not retrieving.
// NEED HELP!

// var refQueue = firebase.database().ref("queue");

// console.log("BlockChain queue worker loaded");

// var blockService = require('../lib/blockchain/blockService');

// var worker = function(data, progress, resolve, reject) {
    
//     progress(1);

//     console.log("BlockchainQueue called with", data);

//     blockService.blockService.add(data).then(function(result) {
//         if(result) {
//             resolve(data)
//         } else {
//             reject("FirebaseQueue rejected " + data)
//         }
  
//     });
// }

// var options = {
//     'specId': 'spec_' + this.id,
//     'numWorkers': 1,
//     'sanitize': false,
//     'suppressStack': true
// };
// var blockchainQueue = new Queue(refQueue, options, worker);
// console.log("FirebaseQueue started ");
  
var ref = firebase.database().ref('queue');
var queue = new Queue(ref, function(data, progress, resolve, reject) {
  // Read and process task data
  console.log(data);

  // Do some work
  progress(50);

  // Finish the task asynchronously
  setTimeout(function() {
    resolve();
  }, 1000);
});


//handle shutdown gracefully
process.on('SIGINT', function() {
    queue.shutdown().then(function() {
        console.log("Finished queue shutdown");
        process.exit(0);
    });
});