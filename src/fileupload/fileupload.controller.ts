// fileupload.controller.ts
import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './fileupload.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

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

  @Get('/s3-file-uploaded/:uid') // This is the route that the S3 bucket redirects to after a file is uploaded
  async fileUploaded(@Req() req) {
    console.log(req.body);
  }
}
