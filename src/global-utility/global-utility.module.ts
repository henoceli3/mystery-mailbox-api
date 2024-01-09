import { Module } from '@nestjs/common';
import { GlobalUtilityController } from './global-utility.controller';
import { GlobalUtilityService } from './global-utility.service';

@Module({
  controllers: [GlobalUtilityController],
  providers: [GlobalUtilityService]
})
export class GlobalUtilityModule {}
