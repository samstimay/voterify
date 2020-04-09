import { logger, Errors } from '../log'
import { firebaseApi } from '../firebase/firebase-api'
import Block from './block'

class BlockInfo {
    public data: Object
    public collection: string

    constructor(data: Object, collection: string) {
        this.data = data
        this.collection = collection
    }

    toString() {
        return `BlockInfo - 
            data           : ${this.data} 
            collectionName : ${this.collection}`
    }
}

class BlockService {
    public async getLastBlock(collectionName: string) {
        return await firebaseApi
            .firestore()
            .collection(collectionName)
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get()
            .then((data: any) => {
                if (data.docs && data.docs.length > 0) {
                    const lastBlockData = data.docs[0]
                    return new Block(
                        lastBlockData.timestamp,
                        lastBlockData.lastHash,
                        lastBlockData.hash,
                        lastBlockData.data
                    )
                }
                return null
            })
            .catch(function (err: any) {
                Errors.log("BlockService.Add can't get recent block. " + err)
                return null
            })
    }

    // add a block and return it's hash
    public async add(blockInfo: BlockInfo) {
        logger.debug('BlockService.Add()', blockInfo.toString())

        try {
            const lastBlock = await this.getLastBlock(blockInfo.collection)

            if (!lastBlock || !lastBlock.hash) {
                Errors.log(
                    "BlockService.Add invalid last block format '" +
                        lastBlock +
                        "'"
                )
                return ''
            }

            const newBlock = Block.mineBlock(lastBlock, blockInfo.data)

            return await firebaseApi
                .firestore()
                .collection(blockInfo.collection)
                .doc(newBlock.hash)
                .set(newBlock)
                .then(() => {
                    return newBlock.hash
                })
                .catch(function (err: any) {
                    Errors.log("BlockService.Add can't add new block. " + err)
                    return ''
                })
        } catch (err) {
            Errors.log('BlockService.Add caught error ' + err)
            return ''
        }
    }
}

const blockService = new BlockService()

export { blockService, BlockInfo }
