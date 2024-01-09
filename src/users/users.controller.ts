import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Version,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { validationResult } from 'express-validator';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post('create')
  @HttpCode(200)
  @Version('1')
  async v1_create(
    @Body('userName') userName: string,
    @Body('email') email: string,
    @Body('deviceToken') deviceToken: string,
    @Req() request: Request,
  ) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new BadRequestException(result);
    }
    return this.service.v1_create(userName, email, deviceToken);
  }

  @Post('checkUserName')
  @HttpCode(200)
  async checkUserName(
    @Body('userName') userName: string,
    @Req() request: Request,
  ) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new BadRequestException(result);
    }
    return this.service.checkUserName(userName);
  }

  @Post('delete')
  @HttpCode(200)
  async delete(@Body('userName') userName: string, @Req() request: Request) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new BadRequestException(result);
    }
    return this.service.delete(userName);
  }
}
