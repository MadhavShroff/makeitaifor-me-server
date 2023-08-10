import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { UsersService } from '../../mongo/users/users.service';

@Injectable()
export class CognitoStrategy extends PassportStrategy(Strategy, 'cognito') {
  private domain: string;
  private region: string;
  private clientId: string;

  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      authorizationURL: CognitoStrategy.authorizationUrl(
        configService.get<string>('OAUTH_COGNITO_DOMAIN'),
        configService.get<string>('OAUTH_COGNITO_REGION'),
      ),
      tokenURL: CognitoStrategy.tokenUrl(
        configService.get<string>('OAUTH_COGNITO_DOMAIN'),
        configService.get<string>('OAUTH_COGNITO_REGION'),
      ),
      clientID: configService.get<string>('OAUTH_COGNITO_ID'),
      clientSecret: configService.get<string>('OAUTH_COGNITO_SECRET'),
      callbackURL: configService.get<string>('OAUTH_COGNITO_REDIRECT_URL'),
    });
    this.domain = configService.get<string>('OAUTH_COGNITO_DOMAIN');
    this.region = configService.get<string>('OAUTH_COGNITO_REGION');
    this.clientId = configService.get<string>('OAUTH_COGNITO_ID');
  }

  static baseUrl(domain: string, region: string): string {
    return `https://${domain}.auth.${region}.amazoncognito.com/oauth2`;
  }

  static authorizationUrl(domain: string, region: string): string {
    return `${this.baseUrl(domain, region)}/authorize`;
  }

  static tokenUrl(domain: string, region: string): string {
    return `${this.baseUrl(domain, region)}/token`;
  }

  static userInfoUrl(domain: string, region: string): string {
    return `${this.baseUrl(domain, region)}/userInfo`;
  }

  async validate(accessToken: string) {
    // Here the `id_token` is also received: https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html
    // But it's not supported by passport-oauth2, only `access_token` is received
    // Therefore another call is made to the userinfo endpoint
    const userinfo = (
      await axios.get(CognitoStrategy.userInfoUrl(this.domain, this.region), {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    ).data;

    let user = await this.usersService.findOne({ id: userinfo.sub });
    if (!user) {
      user = await this.usersService.create({
        provider: 'cognito',
        id: userinfo.sub,
        name: userinfo.name,
        email: userinfo.email,
        username: userinfo.username,
      });
    }
    return user;
  }
}
