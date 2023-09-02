export declare class SecretsManagerService {
    secret_name: string;
    private client;
    constructor();
    getSecret(secretName: string): Promise<string>;
}
