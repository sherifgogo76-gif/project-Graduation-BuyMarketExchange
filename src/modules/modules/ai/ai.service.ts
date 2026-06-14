
// import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
// import axios from 'axios';
// import FormData from 'form-data';

// @Injectable()
// export class AiService {

//   private readonly AI_URL = 'https://charm-deafening-prelaw.ngrok-free.dev/';

//   async analyzeProduct(data: {
//     description: string;
//     images: Express.Multer.File[];
//   }) {

//     try {

//       // ✅ validation
//       if (!data.images || data.images.length < 4) {
//         throw new BadRequestException('At least 4 images are required');
//       }

//       const formData = new FormData();

//       // ✅ text
//       formData.append('text', data.description);

//       // ✅ images (files مش urls)
//       data.images.forEach((file) => {
//         formData.append('image', file.buffer, file.originalname);
//       });

//       const response = await axios.post(
//         this.AI_URL,
//         formData,
//         {
//           headers: {
//             ...formData.getHeaders(),
//           },
//           timeout: 15000
//         }
//       );

//       return response.data;

//     } catch (error) {

//       console.error('AI ERROR:', error?.response?.data || error.message);

//       throw new InternalServerErrorException('AI service failed');
//     }
//   }
// }

import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';

@Injectable()
export class AiService {
  private readonly AI_URL =
    'https://yousef12300331-buymarketapi.hf.space/analyze';

  async analyzeProduct(data: {
    description: string;
    images: Express.Multer.File[];
  }) {
    try {
      // Validation الصور
      if (!data.images || data.images.length < 4) {
        throw new BadRequestException(
          'At least 4 images are required',
        );
      }

      // Validation الوصف
      const words = data.description?.trim().split(/\s+/) || [];

      if (words.length < 25) {
        throw new BadRequestException(
          'Description must contain at least 25 words',
        );
      }

      const formData = new FormData();

      // Description
      formData.append('description', data.description);

      // Images
      data.images.forEach((file) => {
        formData.append(
          'images',
          file.buffer,
          file.originalname,
        );
      });

      const response = await axios.post(
        this.AI_URL,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 30000,
        },
      );

      return response.data;
    } catch (error) {
      console.error(
        'AI ERROR:',
        error?.response?.data || error.message,
      );

      throw new InternalServerErrorException(
        error?.response?.data?.detail ||
          'AI service failed',
      );
    }
  }
}
