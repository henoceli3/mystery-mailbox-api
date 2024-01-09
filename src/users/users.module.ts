import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity/user.entity';
import { GlobalUtilityService } from 'src/global-utility/global-utility.service';
import { body } from 'express-validator';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService, GlobalUtilityService],
  controllers: [UsersController],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        body('userName').notEmpty().isString().escape(),
        body('email').notEmpty().isEmail().escape(),
        body('deviceToken').notEmpty().isString().escape(),
      )
      .forRoutes('v1/users/create');
    consumer
      .apply(body('userName').notEmpty().isString().escape())
      .forRoutes('users/checkUserName');
    consumer
      .apply(body('userName').notEmpty().isString().escape())
      .forRoutes('users/delete');
  }
}
