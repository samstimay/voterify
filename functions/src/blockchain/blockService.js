"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockInfo = exports.blockService = void 0;
const log_1 = require("../log");
const firebase_api_1 = require("../firebase/firebase-api");
const block_1 = require("./block");
class BlockInfo {
    constructor(data, collection) {
        this.data = data;
        this.collection = collection;
    }
    toString() {
        return `BlockInfo - 
            data           : ${this.data} 
            collectionName : ${this.collection}`;
    }
}
exports.BlockInfo = BlockInfo;
class BlockService {
    getLastBlock(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield firebase_api_1.firebaseApi
                .firestore()
                .collection(collectionName)
                .orderBy('timestamp', 'desc')
                .limit(1)
                .get()
                .then((data) => {
                if (data.docs && data.docs.length > 0) {
                    const lastBlockData = data.docs[0];
                    return new block_1.default(lastBlockData.timestamp, lastBlockData.lastHash, lastBlockData.hash, lastBlockData.data);
                }
                return null;
            })
                .catch(function (err) {
                log_1.Errors.log("BlockService.Add can't get recent block. " + err);
                return null;
            });
        });
    }
    // add a block and return it's hash
    add(blockInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            log_1.logger.debug('BlockService.Add()', blockInfo.toString());
            try {
                const lastBlock = yield this.getLastBlock(blockInfo.collection);
                if (!lastBlock || !lastBlock.hash) {
                    log_1.Errors.log("BlockService.Add invalid last block format '" +
                        lastBlock +
                        "'");
                    return '';
                }
                const newBlock = block_1.default.mineBlock(lastBlock, blockInfo.data);
                return yield firebase_api_1.firebaseApi
                    .firestore()
                    .collection(blockInfo.collection)
                    .doc(newBlock.hash)
                    .set(newBlock)
                    .then(() => {
                    return newBlock.hash;
                })
                    .catch(function (err) {
                    log_1.Errors.log("BlockService.Add can't add new block. " + err);
                    return '';
                });
            }
            catch (err) {
                log_1.Errors.log('BlockService.Add caught error ' + err);
                return '';
            }
        });
    }
}
const blockService = new BlockService();
exports.blockService = blockService;
//# sourceMappingURL=blockService.js.map