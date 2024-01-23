import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Api v1.0.0 [MysteryMailbox]';
  }
}
