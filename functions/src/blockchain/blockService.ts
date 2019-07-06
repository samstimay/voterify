import { logger, Errors } from "../log";
import { firebaseApi } from "../firebase/firebase-api";
import Block from "./block"

class BlockService {
    // add a block and return it's hash
    async Add(
        data: object, 
        collectionName: string)
    {
        logger.debug("BlockService.Add()", data.toString());
        const lastBlockData = await firebaseApi
            .firestore()
            .collection(collectionName)            
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
        
        if(!lastBlockData) return '';

        const lastBlock = new Block(lastBlockData.timestamp,
            lastBlockData.lastHash,
            lastBlockData.hash,
            lastBlockData.data);

        const newBlock = Block.mineBlock(lastBlock, data);

        return await firebaseApi
            .firestore()
            .collection(collectionName)
            .doc(newBlock.hash)
            .set(newBlock)
            .then(() => {
                return newBlock.hash;
            })
            .catch(function(err: any) {
                Errors.generic("BlockService.Add can't add new block. " + err)
                return null;
            });            
    }
}

const blockService = new BlockService()

export default blockService;