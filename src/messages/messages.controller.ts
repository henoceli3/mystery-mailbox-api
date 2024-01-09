import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Version,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { validationResult } from 'express-validator';

@Controller('messages')
export class MessagesController {
  constructor(private readonly service: MessagesService) {}

  @Post('create_and_send')
  @HttpCode(200)
  @Version('1')
  async v1_createAndSend(
    @Body('userName') userName: string,
    @Body('message') message: string,
    @Req() request: Request,
  ) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new BadRequestException(result);
    }
    const createdMessage = await this.service.v1_create(userName, message);
    return await this.service.v1_sendMessage(
      userName,
      createdMessage.data.uuid,
      createdMessage.data.message,
      createdMessage.data.created_at,
    );
  }

  @Post('findByUser')
  @HttpCode(200)
  @Version('1')
  async v1_findAllByUser(
    @Body('userName') userName: string,
    @Req() request: Request,
  ) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new BadRequestException(result);
    }
    return await this.service.v1_findAllByUser(userName);
  }

  @Post('markMessageAsRead')
  @HttpCode(200)
  async markMessageAsRead(@Body('uuid') uuid: string, @Req() request: Request) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new BadRequestException(result);
    }
    return await this.service.markMessageAsRead(uuid);
  }

  @Post('deleteOneMessage')
  @HttpCode(200)
  async deleteOneMessage(@Body('uuid') uuid: string, @Req() request: Request) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new BadRequestException(result);
    }
    return await this.service.deleteOneMessage(uuid);
  }

  @Post('deleteMessageList')
  @HttpCode(200)
  async deleteMessageList(
    @Body('uuids') uuids: string[],
    @Req() request: Request,
  ) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new BadRequestException(result);
    }
    return await this.service.deleteMessageList(uuids);
  }
}
