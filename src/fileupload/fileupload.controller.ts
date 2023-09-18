// fileupload.controller.ts
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
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
import { FileData } from 'src/types';

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

  @Post('/getDocumentContent')
  @UseGuards(JwtAuthGuard)
  async getDocumentContent(@Req() req): Promise<FileData | null> {
    const { fileKey } = req.body;
    try {
      // Fetching the processed text from the database
      const text = await this.mongoService.getProcessedText(
        req.user.userId,
        fileKey,
      );

      console.log('Processed Text: ', text);

      if (!text) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      return text;
    } catch (error) {
      // Handling error based on the nature of the error
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('generate-presigned-url')
  @UseGuards(JwtAuthGuard)
  async generateUploadUrl(
    @Query('filename') filename: string,
    @Query('mimetype') mimetype: string,
    @Req() req,
  ): Promise<{ uploadUrl: string }> {
    console.log(req.user);
    const uploadUrl = await this.fileUploadService.generateUploadUrl(
      filename,
      mimetype,
      req.user,
    );
    return { uploadUrl };
  }

  @Get('list-files/:userId')
  @UseGuards(JwtAuthGuard)
  async listFiles(@Param('userId') userId: string): Promise<{ files: any[] }> {
    const files = await this.fileUploadService.listFiles(userId);
    return { files };
  }

  @Get('/s3-file-uploaded')
  async fileUploaded(@Query('objKey') objKey: string, @Res() res) {
    objKey = decodeURIComponent(objKey); // Add this line
    if ((await this.validateObjKey(objKey)) === false) {
      console.log('Invalid objKey received (BAD/CORRUPTED REQUEST): ' + objKey);
      return res.status(400).json({ status: 'Bad Request' });
    }
    console.log(
      'S3 File uploaded: ' + JSON.stringify(objKey) + ' Now processing...',
    );
    const parsedString = await this.processDocument(objKey);
    try {
      await this.mongoService.saveProcessedText(
        objKey.substring(0, 36),
        objKey.substring(37),
        parsedString,
      );
      console.log('Processed Text Saved to MongoDB');
      return res.status(200).json({ status: 'acknowledged' });
    } catch (error) {
      console.error('Operation failed:', error);
      return res
        .status(500)
        .json({ status: 'Internal Server Error', error: error });
    }
  }

  async validateObjKey(objKey: string): Promise<boolean> {
    const sanitizedObjKey = validator.escape(objKey).substring(0, 36);
    const isUUIDValid = validator.isUUID(sanitizedObjKey, 4);
    if (isUUIDValid) {
      return true;
    }
    return false;
  }

  async processDocument(objKey) {
    const url = await this.fileUploadService.generateTemporaryDownloadUrl(
      objKey,
    );
    console.log('Temporary Download URL: ', url);
    const pdf_id = await this.callMathpixApi(url);
    console.log('PDF ID: ', pdf_id);
    let statusResponse;
    do {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      statusResponse = await this.checkProcessingStatus(pdf_id);
      console.log('Status Response: ', statusResponse);
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
      .then((response) => response.data.pdf_id)
      .catch((error) => console.error(error));
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
    }).then((response) => {
      console.log(response.data);
      return response.data;
    });
  }
}
