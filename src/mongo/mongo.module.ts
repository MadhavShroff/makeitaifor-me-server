import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GeneratedTextSchema } from './generated-text.schema'; // example schema
import { ConfigService } from '@nestjs/config';
import { MongoService } from './mongo.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'GeneratedText', schema: GeneratedTextSchema },
    ]),
  ],
  providers: [MongoService],
  exports: [MongoService, MongooseModule],
})
export class MongoModule {}
