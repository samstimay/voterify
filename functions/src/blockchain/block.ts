const SHA256 = require("crypto-js/sha256");

class Block {

    public timestamp: string
    public lastHash: string 
    public hash: string
    public data: Object

    constructor(
        timestamp: string, 
        lastHash: string, 
        hash: string, 
        data: Object) {
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

    static timestamp() : string {
        return Date.now().toString();
    }

    static genesis() {
        return new this("Genesis time", "genesis", "genesis", []);
    }

    static mineBlock(lastBlock: Block, data : Object) {
        const timestamp = Block.timestamp();
        const lastHash = lastBlock.hash;
        const hash = Block.hash(timestamp, lastHash, data);
        return new this(timestamp, lastHash, hash, data);
    }

    static hash(timestamp: string, lastHash: string, data: Object) {
        return SHA256(`${timestamp}${lastHash}${data}`).toString();
    }

    static blockHash(block : Block) {
        const { timestamp, lastHash, data } = block;
        return Block.hash(timestamp, lastHash, data);
    }
}

export default Block;
