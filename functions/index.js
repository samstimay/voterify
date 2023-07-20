/**
 * Copyright 2023 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

import { logger, Errors } from './src/log'
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getFirestore } = require("firebase-admin/firestore");
admin.initializeApp();

logger.debug('API loading...')

exports.getInfo = functions.https.onCall((req, res) => {
    try {
        return getFirestore()
            .collection('System')
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
        return Errors.onCrash(res, error)
    }
});

logger.debug('API loaded')
