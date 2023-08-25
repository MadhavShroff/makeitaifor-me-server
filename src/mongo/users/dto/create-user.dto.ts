import { Provider } from 'src/types';

export class CreateUserDto {
  provider: Provider;
  id: string;
  email: string;
  name: string;
  username: string;
}
