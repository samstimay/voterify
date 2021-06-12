import * as functions from 'firebase-functions'
import { logger } from './log'
import { ElectionApi } from './api/elections'
import { CandidateApi } from './api/candidates'
import { VoteApi } from './api/votes'
import { VoterApi } from './api/voters'
import { SystemApi } from './api/system'
import { PermissionsApi } from './api/permissions'
import scheduler from './pubsub'
import FirebaseQueue from './firebase/queue'
import admin from './firebase/firebaseAdmin-provider'
const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')

// Basic Express Setup with middleware
const app = express()
app.use(cors({ credentials: true, origin: true }))
app.use(bodyParser.json())
app.use(function (req: any, res: any, next: any) {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: 'No credentials sent!' })
    }
    next()
})

app.get('/', function (req: any, res: any) {
    return res.json({ hi: 'there' })
})

logger.debug('API loading...')

// Setup Endpoints
SystemApi.createEndpoints(app)
CandidateApi.createEndpoints(app)
ElectionApi.createEndpoints(app)
VoteApi.createEndpoints(app)
VoterApi.createEndpoints(app)
PermissionsApi.createEndpoints(app)

admin.auth()

VoteApi.blockchainQueue = new FirebaseQueue(admin)

// Export App for use with Firebase Functions
exports.voterifyApi = functions.https.onRequest(app)
logger.debug('API loaded')

scheduler.run()
