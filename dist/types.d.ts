import { User } from './mongo/users/users.schema';
declare module 'express' {
    interface Request {
        user?: User;
    }
}
export type JwtPayload = {
    name: string;
    username: string;
    userId: string;
    role: string;
};
export type Provider = 'google' | 'cognito';
export declare const GuestId = "915b7cd5-08c1-45c2-9709-7585af332ee4";
export declare const GuestUser: User;
export type FileData = {
    meta: S3MetaData;
    parsedContent: string | null;
};
export type S3MetaData = {
    Key: string;
    LastModified: Date;
    ETag: string;
    ChecksumAlgorithm: ChecksumAlgorithmList;
    Size: number;
    StorageClass: ObjectStorageClass;
    Owner: Owner;
    RestoreStatus: RestoreStatus;
};
export type ChecksumAlgorithm = 'CRC32' | 'CRC32C' | 'SHA1' | 'SHA256' | string;
export type ChecksumAlgorithmList = ChecksumAlgorithm[];
export type ObjectStorageClass = 'STANDARD' | 'REDUCED_REDUNDANCY' | 'GLACIER' | 'STANDARD_IA' | 'ONEZONE_IA' | 'INTELLIGENT_TIERING' | 'DEEP_ARCHIVE' | 'OUTPOSTS' | 'GLACIER_IR' | 'SNOW' | string;
export interface Owner {
    DisplayName?: string;
    ID?: string;
}
export interface RestoreStatus {
    IsRestoreInProgress?: boolean;
    RestoreExpiryDate?: Date;
}
