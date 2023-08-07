import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://www.makeitaifor.me',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(cookieParser());
  app.use(csurf({ cookie: true }));
  process.env.APP_ENV === 'dev'
    ? await app.listen(8000)
    : await app.listen(3000);
}
bootstrap();
