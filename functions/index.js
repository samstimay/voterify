/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const logger = require("firebase-functions/logger");
const {onRequest} = require("firebase-functions/v2/https");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getFirestore } = require("firebase-admin/firestore");
const debug = require("./debug");
const shortid = require('shortid');

admin.initializeApp();

logger.debug('Votery Functions loading...')

const collectionNames = {
    elections: "election",
    permissions: "permissions",
    system: "System",
    voters: "voters"
};

/// CONSIDER: SPRINKLING ASYNC

// system
exports.getInfo = onRequest((req, res) => {
    try {
        return getFirestore()
            .collection(collectionNames.system)
            .doc('votery')
            .get()
            .then((data) => {
                const result = {
                    version: data.get('version')
                }
                if (res) return res.json(result)
                return result
            })
    } catch (error) {
        return logger.error(req, error)
    }
});

// auth 
getToken = function(req) {
    let token = req.query.token || req.headers.authorization
    if (token.indexOf('Bearer ') >= 0) {
        token = token.replace('Bearer ', '')
    }
    return token.toString()
}
getAuth = function() {
    return admin.auth()
}
getUser = async function(uid) {
    return await this.getAuth().getUser(uid)
}
var firebaseTokenAuth = onRequest(async (req) => {
    const token = this.getToken(req)
    return await getAuth()
        .verifyIdToken(token)
        .then(function (data) {
            if (data.uid && data.uid.length) return data.uid
            return ''
        })
        .catch(function (msg) {
            logger.error('auth failed', msg)
            return ''
        })
});
exports.firebaseTokenAuth = firebaseTokenAuth;

// permissions
 var getPermissions = onRequest(async (uid) => {
    return getFirestore()
        .collection(collectionNames.permissions)
        .doc(uid)
        .get()
        .then((data) => {
            if (data.exists) {
                return new Permissions(data.get('type'))
            } else {
                return new Permissions('')
            }
        })
        .catch(function (err) {
            throw err
        })
});
exports.getPermissions = getPermissions;

exports.getPermissionsResponse = onRequest(async (req, res, uid) => {
    try {
        return await getPermissions(uid)
            .then((permissions) => {
                return res.json(permissions)
            })
            .catch(function (err) {
                throw err
            })
    } catch (error) {
        return logger.error(res, error)
    }
});

// elections
exports.elections = onRequest((req, res) => {
    try {
        return getFirestore()
            .collection(collectionNames.elections)
            .get()
            .then(function (data) {
                const elections = []
                data.docs.forEach(function (doc) {
                    elections.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
                return res.json(elections)
            })
            .catch(function (err) {
                return logger.error(res, err)
            })
    } catch (error) {
        return logger.error(res, error)
    }
}
);
exports.electionsEditGet = onRequest((req, res) => {
    return firebaseTokenAuth(req)
        .then(async (uid) => {
            if (uid) {
                const permission = await getPermissions(uid)
                if (!permissions.isAdmin()) return res.json([])

                return await getFirestore()
                    .collection(collectionNames.elections)
                    .where('admin', '==', uid)
                    .get()
                    .then(function (data) {
                        const elections = []
                        data.docs.forEach(function (doc) {
                            elections.push({
                                id: doc.id,
                                ...doc.data()
                            })
                        })
                        return res.json(elections)
                    })
            } else return Errors.authFailed(req, res)
        })
        .catch((msg) => {
            return logger.error(res, msg)
        })
});
exports.electionsEditPost = onRequest((req, res) => {
    return firebaseTokenAuth(req)
        .then(async (uid) => {
            if (uid) {
                const permission = await getPermissions(uid)
                if (!permissions.isAdmin()) return res.json([])

                const election = new Election(
                    req.body.name,
                    req.body.id,
                    req.body.region,
                    req.body.date,
                    req.body.candidates || [],
                    req.body.active
                )
            
                if (!election.id) errors.push('No election ID')
            
                
                    if (errors.length === 0) {
                        await getFirestore()
                            .collection(collectionNames.elections)
                            .where('id', '==', election.id)
                            .get()
                            .then(async function (querySnapshot) {
                                if (querySnapshot.empty || querySnapshot.size === 0) {
                                    await getFirestore()
                                        .collection(collectionNames.elections)
                                        .doc(election.id)
                                        .set({
                                            name: election.name,
                                            region: election.region,
                                            date: new Date(),
                                            admin: uid,
                                            active: true
                                        })
                                } else {
                                    querySnapshot.forEach(async function (doc) {
                                        if (doc.get('admin') === uid) {
                                            await getFirestore()
                                                .collection(collectionNames.elections)
                                                .doc(doc.id)
                                                .update({
                                                    name: election.name,
                                                    region: election.region,
                                                    active: election.active
                                                })
                                        } else {
                                            errors.push(
                                                'You are not the admin of this election.'
                                            )
                                        }
                                    })
                                }
                            })
                        election.candidates.forEach(async (candidate) => {
                            if (errors.length) return
                            const err = await CandidateApi.addEditCandidate(candidate)
                            if (err.length) {
                                errors.push(err)
                            }
                        })
                    }
                    if (errors.length) return res.json({ errors })
                    else return res.json(election)
  


            } else return logger.error(req, res)
        })
        .catch((msg) => {
            return logger.error(res, msg)
        })
})

// voter
var getVoter = onRequest(async (req, res) => {
    const uid = await firebaseTokenAuth(req)
    return await getFirestore()
        .collection(collectionNames.voters)
        .doc(uid)
        .get()
        .then((data) => {
            const result = {
                exists: data.exists,
                uid: data.get('uid'),
                voterId: data.get('voterId')
            }
            if (res) return res.json(result)
            return result
        })
        .catch((err) => {
            logger.error(res, err)
            return { exists: false, err: err }
        })
});
exports.getVoter = getVoter;
var voterIdExists = onRequest(async (voterId) => {
    logger.debug('voterIdExists', voterId)
    return getFirestore()
        .collection(collectionNames.voters)
        .where('voterId', '==', voterId)
        .get()
        .then((data) => {
            return data.docs && data.docs.length > 0
        })
        .catch(function (err) {
            return false
        })
});
exports.voterIdExists = voterIdExists;
var newVoterId = onRequest(async (attempts) => {
    if (attempts > 5) {
        logger.error('newVoterId too many attempts.')
        return new Promise<string>(() => {
            return ''
        })
    }
    const voterId = shortid.generate();
    return voterIdExists(voterId).then((exists) => {
        if (!exists) return voterId
        else return newVoterId(attempts + 1)
    })
});
exports.newVoterId = newVoterId;
exports.createVoter = onRequest(async (req, res) => {
    try {
        const uid = await firebaseTokenAuth(req)

        // if the voter exists
        return await getVoter(req).then(async (data) => {
            const existingVoter = data
            // if Voter already exists, return that
            if (
                existingVoter.exists &&
                existingVoter.voterId &&
                existingVoter.voterId.length
            )
                return res.json(existingVoter)
            // Voter does not exist, create a new unique voterId first
            else
                return await newVoterId(0)
                    .then(function (voterId) {
                        const voter = {
                            uid: uid.trim(),
                            voterId: voterId.trim()
                        }

                        logger.message(
                            'Creating new voter: ' + JSON.stringify(voter)
                        )

                        // now create the Voter
                        return getFirestore()
                            .collection('voters')
                            .doc(uid)
                            .set(voter)
                            .then(() => {
                                return res.json(voter)
                            })
                            .catch(function (err) {
                                return logger.error(res, err)
                            })
                    })
                    .catch(() => {
                        return logger.error(res, req)
                    })
        })
    } catch (error) {
        return logger.error(res, error)
    }
});

logger.debug('Votery Functions loaded')
