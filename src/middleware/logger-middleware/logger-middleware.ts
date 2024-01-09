import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log({
      message: `Request received: ${req.method} ${req.url}`,
      date: new Date(),
      data: req.body,
    });
    next();
  }
}
