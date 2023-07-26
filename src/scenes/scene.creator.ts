import {LoggerService} from '../services/logger.service.js';
import {DatabaseClass} from '../db/database.class.js';

export abstract class SceneCreator {
  protected logger: LoggerService;
  protected dbInstance: DatabaseClass;

  constructor() {
    this.logger = new LoggerService();
    this.dbInstance = new DatabaseClass();
  }

  createScene() {}

  getScene() {}
}
