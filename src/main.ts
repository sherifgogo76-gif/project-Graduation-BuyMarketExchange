import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const port = process.env.PORT ?? 5000;
  const app = await NestFactory.create(AppModule);
  
  console.log("DB_URI =", process.env.DB_URI);

  await app.listen(port,'0.0.0.0', () => {
    console.log(`Server is running on port ${port} ✅🚀`);
  });
}

bootstrap();
