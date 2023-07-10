import { Module } from '@nestjs/common';
import { FileUploadService } from './fileupload.service';
import { FileUploadController } from './fileupload.controller';

@Module({
  providers: [FileUploadService],
  controllers: [FileUploadController],
})
export class FileuploadModule {}
