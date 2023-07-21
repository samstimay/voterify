'use strict';

module.exports.jsonPrint = function(jsonString) {
    return JSON.stringify(JSON.parse(jsonString),null,2); 
}