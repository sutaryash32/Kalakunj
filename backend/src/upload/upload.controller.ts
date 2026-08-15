import { Controller, Inject, Post, UploadedFile, UseGuards, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CLOUDINARY_PROVIDER } from './cloudinary.provider';
import { UploadApiResponse, v2 as CloudinaryType } from 'cloudinary';
import * as streamifier from 'streamifier';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(@Inject(CLOUDINARY_PROVIDER) private cloudinary: typeof CloudinaryType) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an image to Cloudinary (admin only)' })
  @ApiResponse({ status: 201, description: 'Returns the uploaded image URL.', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
