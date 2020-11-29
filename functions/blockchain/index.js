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
const axios = require('axios');
const Swagger = require('swagger-client');
const secrets_provider_1 = require("../src/services/secrets-provider");
const secrets = secrets_provider_1.default.Azure();
class BlockchainApi {
    constructor() {
        this.AUTHORITY = secrets.authority;
        this.WORKBENCH_API_URL = secrets.workbench_api_url;
        this.RESOURCE = secrets.resource;
        this.CLIENT_APP_Id = secrets.client_api_id;
        this.CLIENT_SECRET = secrets.client_secret;
        // Getting token from AAD
        this.acquireTokenWithClientCredentials = () => __awaiter(this, void 0, void 0, function* () {
            const requestBody = {
                resource: this.RESOURCE,
                client_id: this.CLIENT_APP_Id,
                client_secret: this.CLIENT_SECRET,
                grant_type: 'client_credentials'
            };
            const response = yield axios({
                method: 'POST',
                url: `${this.AUTHORITY}/oauth2/token`,
                data: JSON.stringify(requestBody),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            return response.data;
        });
        this.send = (message) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield this.acquireTokenWithClientCredentials();
                const request = {
                    url: `${this.WORKBENCH_API_URL}/api/v2/contracts?workflowId=1&contractCodeId=1&connectionId=1`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8;odata=verbose',
                        Authorization: `Bearer ${token.access_token}`
                    },
                    body: {
                        workflowActionInput: {
                            workflowFunctionID: 1,
                            workflowActionParameters: [
                                {
                                    name: 'RequestMessage',
                                    value: message,
                                    workflowFunctionParameterId: 2
                                }
                            ]
                        }
                    }
                };
                return yield Swagger.http(request);
            }
            catch (err) {
                console.error(err);
            }
        });
    }
}
exports.default = BlockchainApi;
//# sourceMappingURL=index.js.map