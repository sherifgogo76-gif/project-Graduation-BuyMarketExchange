// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';


// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
  
//   console.log("DB_URI =", process.env.DB_URI);

//   const port = process.env.PORT || 3000;

//   await app.listen(port, "0.0.0.0");

//   console.log(`Server is running on port ${port} ✅🚀`);
// }

// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // 👈 تأكد إن دي موجودة
import { join } from 'path'; // 👈 دي اللي كانت ناقصة ومسببة الإيرور الثاني

async function bootstrap() {
  // 🔥 تعديل السطر ده بإضافة <NestExpressApplication> عشان يحل الإيرور الأول
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // السطر السحري لإتاحة الفولدر للعامة
  app.useStaticAssets(join(__dirname, '..', 'BuyMarketExchange'), {
    prefix: '/BuyMarketExchange/',
  });

  console.log("DB_URI =", process.env.DB_URI);

  const port = process.env.PORT || 3000;

  await app.listen(port, "0.0.0.0");

  console.log(`Server is running on port ${port} ✅🚀`);
}

bootstrap();


