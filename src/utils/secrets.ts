import { Injectable } from '@nestjs/common';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

@Injectable()
export class SecretsManagerService {
  secret_name = 'prod/AllTheSecrets';
  private client: SecretsManagerClient;

  constructor() {
    this.client = new SecretsManagerClient({
      region: 'us-east-2',
    });
  }

  async getSecrets(): Promise<string> {
    let response;
    try {
      response = await this.client.send(
        new GetSecretValueCommand({
          SecretId: this.secret_name,
          VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
        }),
      );
    } catch (error) {
      // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
      throw error;
    }

    const secrets = response.SecretString;
    return secrets;
  }
}
