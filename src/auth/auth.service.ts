import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import axios, { AxiosResponse } from 'axios';
import * as querystring from 'querystring';

dotenv.config();

@Injectable()
export class AuthService {
  async exchangeCodeForTokens(code: string): Promise<AxiosResponse> {
    const data = querystring.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.OAUTH_COGNITO_ID,
      code: code,
      redirect_uri: process.env.OAUTH_COGNITO_REDIRECT_URL,
    });
    const auth = {
      username: process.env.OAUTH_COGNITO_ID,
      password: process.env.OAUTH_COGNITO_SECRET,
    };
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const response = await axios.post(
      `https://${process.env.OAUTH_COGNITO_DOMAIN}.auth.${process.env.OAUTH_COGNITO_REGION}.amazoncognito.com/oauth2/token`,
      data,
      { auth, headers },
    );
    return response;
  }
}
