interface FirebaseSecrets {
    type: String
    project_id: String
    private_key_id: String
    private_key: String
    client_email: String
    client_id: String
    auth_uri: String
    token_uri: String
    auth_provider_x509_cert_url: String
    client_x509_cert_url: String
}

interface AzureSecrets {
    authority: String
    workbench_api_url: String
    resource: String
    client_api_id: String
    client_secret: String
    tenant: String
}

class SecretsProvider {
    public static Azure = (): AzureSecrets => {
        return require('../../secrets/azure-secrets.json')
    }

    public static Firebase = (): FirebaseSecrets => {
        return require('../../secrets/firebase-secrets.json')
    }
}

export { FirebaseSecrets, AzureSecrets, SecretsProvider }
