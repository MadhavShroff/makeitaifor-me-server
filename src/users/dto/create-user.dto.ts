import { Provider } from '../../types/user';

export class CreateUserDto {
  provider: Provider;
  id: string;
  email: string;
  name: string;
  username: string;
}