import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useStaticAssets(join(__dirname, '..', 'BuyMarketExchange'), {
    prefix: '/BuyMarketExchange/',
  });

  console.log("DB_URI =", process.env.DB_URI);

  const port = process.env.PORT || 3000;

  await app.listen(port, "0.0.0.0");

  console.log(`Server is running on port ${port} ✅🚀`);
}

bootstrap();


