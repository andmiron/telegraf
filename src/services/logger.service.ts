import { ConfigService } from './config.service';
import { EnvironmentVariableKeys, LoggerOptions } from '../types/types';
import { pino, TransportSingleOptions } from 'pino';
import { cwd } from 'node:process';
import path from 'node:path';

export class LoggerService {
   private readonly logger: pino.Logger;

   constructor() {
      const envConfig = new ConfigService().getToken(EnvironmentVariableKeys.NODE_ENV);

      const transport: TransportSingleOptions =
         envConfig === LoggerOptions.DEVELOPMENT ? this.createDevTransport() : this.createProdTransport();

      this.logger = pino({
         level: LoggerOptions.LEVEL_INFO,
         timestamp: pino.stdTimeFunctions.isoTime,
         transport,
      });
   }

   createDevTransport(): TransportSingleOptions {
      return {
         target: LoggerOptions.PINO_PRETTY,
         options: {
            colorize: true,
            singleLine: true,
            ignore: LoggerOptions.IGNORE_FIELDS,
         },
      };
   }

   createProdTransport(): TransportSingleOptions {
      return {
         target: LoggerOptions.PINO_FILE,
         options: {
            destination: path.join(cwd(), LoggerOptions.LOG_PATH),
         },
      };
   }

   logInfo(info: string): void {
      this.logger.info({ info });
   }

   logError(errMsg: string): void {
      this.logger.error({ error: errMsg });
   }
}
