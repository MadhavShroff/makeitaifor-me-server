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

    // Your code goes here
  }

  async getSecret(secretName: string): Promise<string> {
    // Use this code snippet in your app.
    // If you need more information about configurations or implementing the sample code, visit the AWS docs:
    // https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

    let response;
    try {
      response = await this.client.send(
        new GetSecretValueCommand({
          SecretId: this.secret_name,
          VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
        }),
      );
    } catch (error) {
      // For a list of exceptions thrown, see
      // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
      throw error;
    }

    const secrets = response.SecretString;
    return secrets;
  }
}
