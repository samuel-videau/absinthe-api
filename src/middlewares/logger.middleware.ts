import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const ipAddress = req.ip;
    const url = req.originalUrl;
    const method = req.method;

    res.on('finish', () => {
      const responseTime = Date.now() - start;
      const statusCode = res.statusCode;
      if (url !== '/healthz') {
        this.logger.log(
          `${method} request from IP ${ipAddress} to URL ${url} with status ${statusCode} in ${responseTime}ms`,
        );
      }
    });

    next();
  }
}
