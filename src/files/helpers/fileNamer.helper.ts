import { UnprocessableEntityException } from '@nestjs/common';

/* eslint-disable @typescript-eslint/ban-types */
export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file)
    return callback(
      new UnprocessableEntityException('File is not provided'),
      false,
    );

  const fileExtension = file.mimetype.split('/')[1];
  const fileName = `${file.originalname}-${Date.now()}.${fileExtension}`;

  return callback(null, fileName);
};
