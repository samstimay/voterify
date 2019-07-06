"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SHA256 = require("crypto-js/sha256");
class Block {
    constructor(timestamp, lastHash, hash, data) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }
    toString() {
        return `Block - 
            Timestamp: ${this.timestamp} 
            LastHash : ${this.lastHash.substring(0, 8)} 
            Hash     : ${this.hash.substring(0, 8)} 
            Data     : ${this.data}`;
    }
    static timestamp() {
        return Date.now().toString();
    }
    static genesis() {
        return new this("Genesis time", "genesis", "genesis", []);
    }
    static mineBlock(lastBlock, data) {
        const timestamp = Block.timestamp();
        const lastHash = lastBlock.hash;
        const hash = Block.hash(timestamp, lastHash, data);
        return new this(timestamp, lastHash, hash, data);
    }
    static hash(timestamp, lastHash, data) {
        return SHA256(`${timestamp}${lastHash}${data}`).toString();
    }
    static blockHash(block) {
        const { timestamp, lastHash, data } = block;
        return Block.hash(timestamp, lastHash, data);
    }
}
exports.default = Block;
//# sourceMappingURL=block.js.map