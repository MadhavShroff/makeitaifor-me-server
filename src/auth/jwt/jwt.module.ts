// jwt.module.ts
import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthStrategy } from './jwt.strategy';
import { JwtAuthService } from './jwt.service';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '2 days' },
      }),
    }),
  ],
  providers: [JwtAuthService, JwtAuthStrategy], // Ensure JwtService is provided here
  exports: [JwtAuthService], // Ensure JwtService is exported as well
})
export class JwtModule {}
