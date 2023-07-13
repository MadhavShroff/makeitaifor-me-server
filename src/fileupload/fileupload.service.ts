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
      Bucket: user.id, // replace with your bucket name
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
    const bucketParams = {
      Bucket: user.id, // replace with your bucket name
    };
    try {
      // Check if the bucket exists
      await this.s3.headBucket(bucketParams).promise();
      console.log('Bucket already exists');
    } catch (error) {
      if (error.code === 'NotFound') {
        console.log('Bucket does not exist, creating now');
        await this.s3.createBucket(bucketParams).promise();
      } else {
        throw error;
      }
    }
    const params = {
      Bucket: user.id,
      Key: filename,
      ContentType: mimetype,
      ACL: 'public-read', // files will be publicly readable
      Expires: 60 * 60, // presigned URL expiration time in seconds
    };
    console.log(params);
    return this.s3.getSignedUrlPromise('putObject', params);
  }
}
