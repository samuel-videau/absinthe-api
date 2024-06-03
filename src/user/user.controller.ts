import { Controller, InternalServerErrorException, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UserService } from './user.service';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: User })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(): Promise<User> {
    try {
      return this.userService.create();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
