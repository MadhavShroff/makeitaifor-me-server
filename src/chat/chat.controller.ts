import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { FileUploadService } from 'src/fileupload/fileupload.service';
import { MongoService } from 'src/mongo/mongo.service';
import { FileData } from 'src/types/chats';

@Controller('chats')
export class ChatController {
  constructor(
    private fileUploadService: FileUploadService,
    private mongoService: MongoService,
    private configService: ConfigService,
  ) {}

  @Get('/getDocumentContent')
  @UseGuards(JwtAuthGuard) // You may want to uncomment this if authentication is needed
  async getDocumentContent(
    @Query('fileId') ETag: string,
    @Query('userId') userId: string, // Extract userId from query params
    @Req() req,
  ): Promise<FileData | null> {
    try {
      // Fetching the processed text from the database
      const text = await this.mongoService.getProcessedText(req.user.id, ETag);

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
}
