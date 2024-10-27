import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';

@Injectable()
export class FilesService {
  getStaticFile(imageName: string) {
    const path = join(__dirname, '../../', 'statics', 'uploads', imageName);

    if (!existsSync(path))
      throw new BadRequestException(`no image found with ${imageName}`);

    return path;
  }
}
