// fileupload.controller.ts
import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './fileupload.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import validator from 'validator';
import { MongoService } from 'src/mongo/mongo.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Controller('fileupload')
export class FileUploadController {
  constructor(
    private fileUploadService: FileUploadService,
    private mongoService: MongoService,
    private configService: ConfigService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async uploadFile(@UploadedFile() file, @Req() req) {
    const { originalname, buffer, mimetype } = file;
    const url = await this.fileUploadService.uploadFile(
      buffer,
      originalname,
      mimetype,
      { user: req.user },
    );
    return { url };
  }

  @Get('generate-presigned-url')
  @UseGuards(JwtAuthGuard)
  async generateUploadUrl(
    @Query('filename') filename: string,
    @Query('mimetype') mimetype: string,
    @Req() req,
  ): Promise<{ uploadUrl: string }> {
    console.log(filename, mimetype);
    console.log(req.user);
    const uploadUrl = await this.fileUploadService.generateUploadUrl(
      filename,
      mimetype,
      req.user,
    );
    return { uploadUrl };
  }

  @Get('list-files')
  @UseGuards(JwtAuthGuard)
  async listFiles(@Req() req): Promise<{ files: any[] }> {
    const files = await this.fileUploadService.listFiles(req.user);
    return { files };
  }

  @Get('/s3-file-uploaded')
  async fileUploaded(@Query('objKey') objKey: string, @Res() res) {
    if ((await this.validateObjKey(objKey)) === false) {
      return res.status(400).json({ status: 'Bad Request' });
    }
    console.log('Sanitized ObjKey:', objKey);
    const parsedString = await this.processDocument(objKey);
    console.log('Parsed string:', parsedString);
    try {
      await this.mongoService.saveProcessedText(
        objKey.substring(0, 36),
        objKey.substring(37),
        parsedString,
      );
      return res.status(200).json({ status: 'acknowledged' });
    } catch (error) {
      console.error('Operation failed:', error);
      return res
        .status(500)
        .json({ status: 'Internal Server Error', error: error });
    }
  }

  async validateObjKey(objKey: string): Promise<boolean> {
    const sanitizedObjKey = validator.escape(objKey).split('&#x2F;');
    const regex = /^[a-zA-Z0-9_\-\.]+\.[a-zA-Z0-9]{2,}$/;
    if (
      validator.isUUID(sanitizedObjKey[0], 4) &&
      regex.test(sanitizedObjKey[1])
    )
      return true;
    return false;
  }

  async processDocument(objKey) {
    const url = await this.fileUploadService.generateTemporaryDownloadUrl(
      objKey,
    );
    const pdf_id = await this.callMathpixApi(url);

    let statusResponse;
    do {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      statusResponse = await this.checkProcessingStatus(pdf_id);
    } while (
      statusResponse.status !== 'completed' &&
      statusResponse.status !== 'error'
    );

    return await this.getCompletedResult(pdf_id);
  }

  async callMathpixApi(url) {
    const data = { url: url };
    const headers = {
      app_id: this.configService.get('MATHPIX_APP_ID'),
      app_key: this.configService.get('MATHPIX_APP_KEY'),
      'Content-type': 'application/json',
    };
    return axios
      .post('https://api.mathpix.com/v3/pdf', data, { headers })
      .then((response) => response.data.pdf_id);
  }

  async checkProcessingStatus(pdfId): Promise<string> {
    return axios({
      method: 'GET',
      url: `https://api.mathpix.com/v3/pdf/${pdfId}`,
      headers: {
        app_id: this.configService.get('MATHPIX_APP_ID'),
        app_key: this.configService.get('MATHPIX_APP_KEY'),
      },
    }).then((response) => response.data);
  }

  async getCompletedResult(pdfId): Promise<string> {
    return axios({
      method: 'GET',
      url: `https://api.mathpix.com/v3/pdf/${pdfId}.mmd`,
      headers: {
        app_id: this.configService.get('MATHPIX_APP_ID'),
        app_key: this.configService.get('MATHPIX_APP_KEY'),
      },
    }).then((response) => response.data);
  }
}
