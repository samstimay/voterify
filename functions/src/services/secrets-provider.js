"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FirebaseSecrets {
    constructor() {
        this.type = String;
        this.project_id = String;
        this.private_key_id = String;
        this.private_key = String;
        this.client_email = String;
        this.client_id = String;
        this.auth_uri = String;
        this.token_uri = String;
        this.auth_provider_x509_cert_url = String;
        this.client_x509_cert_url = String;
    }
}
class AzureSecrets {
    constructor() {
        this.authority = String;
        this.workbench_api_url = String;
        this.resource = String;
        this.client_api_id = String;
        this.client_secret = String;
    }
}
class SecretsProvider {
}
exports.default = SecretsProvider;
SecretsProvider.Azure = () => {
    return require('../../secrets/azure-secrets.json');
};
SecretsProvider.Firebase = () => {
    return require('../../secrets/firebase-secrets.json');
};
//# sourceMappingURL=secrets-provider.js.map