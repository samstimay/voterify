/* eslint-disable promise/always-return */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable promise/catch-or-return */
var Queue = require('firebase-queue'),
    Firebase = require('firebase');
    
var firebase = Firebase.initializeApp({
    credential: "../secrets/voterify-7637e-firebase-adminsdk-nal41-d99d35a65e.json",
    databaseURL: "https://voterify-7637e.firebaseio.com"
});

var refQueue = firebase.database().ref("queue");

console.log("BlockChain queue worker loaded");

var blockService = require('../lib/blockchain/blockService');

var worker = function(data, progress, resolve, reject) {
    
    console.log("BlockchainQueue called with", data);

    blockService.blockService.add(data).then(function(result) {
        if(result) {
            resolve(data)
        } else {
            reject("FirebaseQueue rejected " + data)
        }
  
    });
}

// const options = {
//     'specId': 'spec_' + this.id,
//     'numWorkers': 1,
//     'sanitize': false,
//     'suppressStack': true
// };
var blockchainQueue = new Queue(refQueue, worker);
console.log("FirebaseQueue started ");
  

//handle shutdown gracefully
// process.on('SIGINT', function() {
//     blockchainQueue.shutdown().then(function() {
//         logger.message("Finished queue shutdown");
//         process.exit(0);
//     });
// });