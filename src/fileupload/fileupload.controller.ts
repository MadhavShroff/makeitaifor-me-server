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
import { escape } from 'validator';

@Controller('fileupload')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

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
  async fileUploaded(
    @Query('userId') userId: string,
    @Query('fileName') fileName: string,
    @Res() res,
  ) {
    const sanitizedUserId = escape(userId);
    const sanitizedFileName = escape(fileName);

    console.log('Sanitized UserId:', sanitizedUserId);
    console.log('Sanitized FileName:', sanitizedFileName);

    return res.status(200).json({ status: 'acknowledged' });
  }
}
