
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

// import {
//   Injectable,
//   InternalServerErrorException,
//   BadRequestException,
// } from '@nestjs/common';
// import axios from 'axios';
// import FormData from 'form-data';

// @Injectable()
// export class AiService {
//   private readonly AI_URL =
//     'https://yousef12300331-buymarketapi.hf.space/analyze';

//   async analyzeProduct(data: {
//     description: string;
//     images: Express.Multer.File[];
//   }) {
//     try {
//       // Validation الصور
//       if (!data.images || data.images.length < 4) {
//         throw new BadRequestException(
//           'At least 4 images are required',
//         );
//       }

//       // Validation الوصف
//       const words = data.description?.trim().split(/\s+/) || [];

//       if (words.length < 10) {
//         throw new BadRequestException(
//           'Description must contain at least 10 words',
//         );
//       }

//       const formData = new FormData();

//       // Description
//       formData.append('description', data.description);

//       // Images
//       data.images.forEach((file) => {
//         formData.append(
//           'images',
//           file.buffer,
//           file.originalname,
//         );
//       });

//       const response = await axios.post(
//         this.AI_URL,
//         formData,
//         {
//           headers: {
//             ...formData.getHeaders(),
//           },
//           timeout: 30000,
//         },
//       );

//       return response.data;
//     } catch (error) {
//       console.error(
//         'AI ERROR:',
//         error?.response?.data || error.message,
//       );

//       throw new InternalServerErrorException(
//         error?.response?.data?.detail ||
//           'AI service failed',
//       );
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

  // 🔥 دالة مساعدة سريعة للترجمة التلقائية من العربي للإنجليزي
  private async translateToEnglish(text: string): Promise<string> {
    try {
      const response = await axios.get(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`,
        { timeout: 5000 }
      );
      // تجميع النص المترجم
      return response.data[0].map((item: any) => item[0]).join('');
    } catch (error) {
      console.error('Translation failed, using original text:', error.message);
      return text; // لو الترجمة فشلت لأي سبب بنبعت النص الأصلي كـ Fallback
    }
  }

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

      if (words.length < 10) {
        throw new BadRequestException(
          'Description must contain at least 10 words',
        );
      }

      // 🔥 الحل السحري: ترجمة الوصف تلقائياً للإنجليزي قبل إرساله لموديل الـ AI
      console.log('Original Description:', data.description);
      const translatedDescription = await this.translateToEnglish(data.description);
      console.log('Translated Description for AI:', translatedDescription);

      const formData = new FormData();

      // بتبعت الوصف المترجم للـ AI عشان يفهمه بنسبة 100% ويطلع التصنيف سليم
      formData.append('description', translatedDescription);

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
