import {
  Controller,
  NotFoundException,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      limits: { fileSize: 1 * 1024 * 1024 },
      storage: diskStorage({
        destination: './statics/uploads',
        filename: fileNamer,
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new NotFoundException('File is empty');
      }
      return 'upload file';
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }
}
