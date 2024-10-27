import { UnprocessableEntityException } from '@nestjs/common';

/* eslint-disable @typescript-eslint/ban-types */
export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) {
    return callback(new Error('File is not provided'), false);
  }

  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (!validExtensions.includes(fileExtension)) {
    return callback(
      new UnprocessableEntityException('File must be a valid image'),
      false,
    );
  }

  return callback(null, true);
};
