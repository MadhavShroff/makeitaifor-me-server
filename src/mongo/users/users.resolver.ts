import { Resolver, Query } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.schema';

@Resolver((_of) => User)
export class UsersResolver {
  constructor(@Inject(UsersService) private usersService: UsersService) {}

  @Query((_returns) => [User])
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  //   @Query((_returns) => User)
  //   @UseGuards(GqlAuthGuard)
  //   whoAmI(@CurrentUser() user: User) {
  //     return this.usersService.findOne({ _id: user.id });
  //   }
}
