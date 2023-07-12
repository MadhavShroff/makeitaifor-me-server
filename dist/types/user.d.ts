export type Provider = 'google' | 'cognito';
export declare class User {
    id: string;
    provider: Provider;
    email: string;
    name: string;
    username: string;
    created_at: Date;
    updated_at: Date;
}
