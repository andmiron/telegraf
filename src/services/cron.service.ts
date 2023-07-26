import {CronJob} from 'cron';
import {DatabaseClass} from '../db/database.class.js';
import {ConfigService} from './config.service.js';
import {EnvironmentVariableKeys} from '../types/types.js';

export class CronService {
  private cronJob: CronJob;
  private dbInstance: DatabaseClass;

  constructor(database: DatabaseClass) {
    this.dbInstance = database;

    this.cronJob = new CronJob('* * * * *', this.onTick);
  }

  async onTick() {
    console.log('every minute');
  }

  start() {
    this.cronJob.start();
  }
}
