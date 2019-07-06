import { logger, Errors } from "../log";
import { firebaseApi } from "../firebase/firebase-api";
import Block from "./block"

class BlockInfo {
    public data: Object;
    public collection: string;

    constructor(
        data: Object, 
        collection: string) {
        this.data = data;
        this.collection = collection;
    }

    toString() {
        return `BlockInfo - 
            data           : ${this.data} 
            collectionName : ${this.collection}`;
    }
}

class BlockService {
    // add a block and return it's hash
    public async add(blockInfo : BlockInfo)
    {
        logger.debug("BlockService.Add()", blockInfo.toString());

        const lastBlockData = await firebaseApi
            .firestore()
            .collection(blockInfo.collection)            
            .orderBy("timestamp", "desc")
            .limit(1)
            .get()
            .then((data: any) => {
                return (data.docs && data.docs.length > 0) ?
                    data.docs[0] :
                    null;
            })
            .catch(function(err: any) {
                Errors.generic("BlockService.Add can't get recent block. " + err)
                return null;
            });
        
        if(!lastBlockData || !lastBlockData.hash) {
            Errors.generic("BlockService.Add invalid last block format '" + JSON.stringify(lastBlockData) + "'");
            return '';
        } 

        const lastBlock = new Block(
            lastBlockData.timestamp,
            lastBlockData.lastHash,
            lastBlockData.hash,
            lastBlockData.data
        );

        const newBlock = Block.mineBlock(lastBlock, blockInfo.data);

        return await firebaseApi
            .firestore()
            .collection(blockInfo.collection)
            .doc(newBlock.hash)
            .set(newBlock)
            .then(() => {
                return newBlock.hash;
            })
            .catch(function(err: any) {
                Errors.generic("BlockService.Add can't add new block. " + err)
                return '';
            });            
    }
}

const blockService = new BlockService()

export { blockService, BlockInfo };
