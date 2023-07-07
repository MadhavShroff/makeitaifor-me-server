export type Provider = 'google' | 'cognito';

export class User {
  id: number;
  provider: Provider;
  providerId: string;
  email: string;
  name?: string;
  created_at: Date;
  updated_at: Date;
}
