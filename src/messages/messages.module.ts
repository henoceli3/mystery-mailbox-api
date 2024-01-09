import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesEntity } from './messages.entity/messages.entity';
import { UserEntity } from 'src/users/user.entity/user.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { body } from 'express-validator';

@Module({
  imports: [TypeOrmModule.forFeature([MessagesEntity, UserEntity])],
  controllers: [MessagesController],
  providers: [MessagesService, FirebaseService],
})
export class MessagesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        body('userName').notEmpty().isString(),
        body('message').notEmpty().isString(),
      )
      .forRoutes('v1/messages/create_and_send');
    consumer
      .apply(body('userName').notEmpty().isString())
      .forRoutes('v1/messages/findByUser');

    consumer
      .apply(body('uuid').notEmpty().isString())
      .forRoutes('messages/markAsRead');

    consumer
      .apply(body('uuid').notEmpty().isString())
      .forRoutes('v1/messages/deleteOneMessage');

    consumer
      .apply(body('uuids').isArray())
      .forRoutes('messages/deleteMessageList');
  }
}
