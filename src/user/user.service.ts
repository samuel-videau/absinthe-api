import { Injectable } from '@nestjs/common';
import { User } from 'src/db/entities/user.entity';
import { UserTableService } from 'src/db/tables/user.service';

@Injectable()
export class UserService {
  constructor(protected userTable: UserTableService) {}

  async create(): Promise<User> {
    return await this.userTable.createUser('user', 0);
  }
}
