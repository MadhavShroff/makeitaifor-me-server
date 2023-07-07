import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import JwtAuthService from './jwt.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '60s' }, // customize according to your needs
      }),
    }),
  ],
  providers: [JwtAuthService],
  exports: [JwtAuthService], // If you want to use JwtAuthService in other modules
})
export class JwtModule {}