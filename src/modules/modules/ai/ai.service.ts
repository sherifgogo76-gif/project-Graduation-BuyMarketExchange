// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import axios from 'axios';

// @Injectable()
// export class AiService {

//   private readonly AI_URL = 'http://AI_URL/predict'; // 👈 غيره لما تستلم API

//   async analyzeProduct(data: {
//     description: string;
//     images: string[];
//   }) {

//     try {

//       const response = await axios.post(
//         this.AI_URL,                            //url
//         {
//           description: data.description,
//           images: data.images                  //body
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           timeout: 10000
//         }
//       );

//       return response.data;

//     } catch (error) {

//       console.error('AI ERROR:', error?.response?.data || error.message);

//       throw new InternalServerErrorException('AI service failed');
//     }
//   }

// }


import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';

@Injectable()
export class AiService {

  private readonly AI_URL = 'https://charm-deafening-prelaw.ngrok-free.dev/';

  async analyzeProduct(data: {
    description: string;
    images: Express.Multer.File[];
  }) {

    try {

      // ✅ validation
      if (!data.images || data.images.length < 4) {
        throw new BadRequestException('At least 4 images are required');
      }

      const formData = new FormData();

      // ✅ text
      formData.append('text', data.description);

      // ✅ images (files مش urls)
      data.images.forEach((file) => {
        formData.append('image', file.buffer, file.originalname);
      });

      const response = await axios.post(
        this.AI_URL,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 15000
        }
      );

      return response.data;

    } catch (error) {

      console.error('AI ERROR:', error?.response?.data || error.message);

      throw new InternalServerErrorException('AI service failed');
    }
  }
}