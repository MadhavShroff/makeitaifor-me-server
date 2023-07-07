import { Provider } from '../../types/user';

export class CreateUserDto {
  provider: Provider;
  providerId: string;
  email: string;
  name: string;
}
