import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
  async exchangeCodeForTokens(code: string) {
    const response = await axios.post(
      `https://your-domain.auth.us-east-1.amazoncognito.com/oauth2/token?grant_type=authorization_code&client_id=your_app_client_id&code=${code}&redirect_uri=https://your_redirect_uri`,
      {},
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    const tokens = response.data;
    return tokens;
  }
}
