// fileupload.service.ts
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class FileUploadService {
  private s3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }
  async uploadFile(
    buffer: Buffer,
    name: string,
    type: string,
    user: any,
  ): Promise<string> {
    const readableStream: Readable = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    const params = {
      Bucket: user.userId, // replace with your bucket name
      Key: name,
      Body: readableStream,
      ACL: 'public-read', // files will be publicly readable
      ContentType: type,
    };

    return new Promise((resolve, reject) => {
      this.s3.upload(params, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data.Location);
        }
      });
    });
  }

  async generateUploadUrl(
    filename: string,
    mimetype: string,
    user: any,
  ): Promise<string> {
    const params = {
      Bucket: `${this.configService.get('AWS_S3_BUCKET_NAME')}/${user.userId}`,
      Key: filename,
      ContentType: mimetype,
      Expires: 60 * 60, // presigned URL expiration time in seconds
    };
    return this.s3.getSignedUrlPromise('putObject', params);
  }

  async generateTemporaryDownloadUrl(objKey: string): Promise<string> {
    console.log('objKey: ', objKey);
    const params = {
      Bucket: `${this.configService.get('AWS_S3_BUCKET_NAME')}`,
      Key: objKey,
      Expires: 60 * 60, // presigned URL expiration time in seconds
    };
    return this.s3.getSignedUrlPromise('getObject', params);
  }

  async listFiles(userId: string): Promise<any[]> {
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Prefix: `${userId}/`,
    };
    return new Promise((resolve, reject) => {
      this.s3.listObjectsV2(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Contents);
        }
      });
    });
  }
}
