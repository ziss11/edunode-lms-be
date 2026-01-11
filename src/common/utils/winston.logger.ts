/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';

export class WinstonLogger implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.ms(),
        format.printf(({ timestamp, level, message, context, ms }) => {
          return `${timestamp} [${context || 'Application'}] ${level.toUpperCase()}: ${message} ${ms}`;
        }),
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize({ all: true }),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(({ timestamp, level, message, context, ms }) => {
              return `[Nest] ${process.pid}  - ${timestamp}     ${level} [${context || 'Application'}] ${message} ${ms}`;
            }),
          ),
        }),
      ],
    });
  }

  log(message: string, ...optionalParams: any[]) {
    this.logger.info(message, { context: this.getContext(optionalParams) });
  }

  error(message: string, ...optionalParams: any[]) {
    this.logger.error(message, { context: this.getContext(optionalParams) });
  }

  warn(message: string, ...optionalParams: any[]) {
    this.logger.warn(message, { context: this.getContext(optionalParams) });
  }

  debug(message: string, ...optionalParams: any[]) {
    this.logger.debug(message, { context: this.getContext(optionalParams) });
  }

  verbose(message: string, ...optionalParams: any[]) {
    this.logger.verbose(message, { context: this.getContext(optionalParams) });
  }

  private getContext(args: any[]): string {
    if (args?.length > 0) {
      return args[args.length - 1];
    }
    return 'Application';
  }
}
