import { Controller, Inject, Post, UploadedFile, UseGuards, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CLOUDINARY_PROVIDER } from './cloudinary.provider';
import { UploadApiResponse, v2 as CloudinaryType } from 'cloudinary';
import * as streamifier from 'streamifier';

@Controller('upload')
export class UploadController {
  constructor(@Inject(CLOUDINARY_PROVIDER) private cloudinary: typeof CloudinaryType) {}

  // Admin only — image goes straight to Cloudinary, we return its CDN URL
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        { folder: 'catalogue' },
        (error, res) => (error ? reject(error) : resolve(res as UploadApiResponse)),
      );
      streamifier.createReadStream(file.buffer).pipe(stream);
    });
    return { url: result.secure_url };
  }
}
