export declare class SecretsManagerService {
    secret_name: string;
    private client;
    constructor();
    getSecrets(): Promise<string>;
}
