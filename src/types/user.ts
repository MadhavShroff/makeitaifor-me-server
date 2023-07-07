export type Provider = 'google' | 'cognito';

export class User {
  id: string;
  provider: Provider;
  providerId: string;
  email: string;
  name: string;
  username: string;
  created_at: Date;
  updated_at: Date;
}
