import {TelegrafService} from './services/telegraf.service.js';

class App {
  init(): void {
    const botHandler = new TelegrafService();

    botHandler.registerMiddlewares();
    botHandler.registerCommands();
    botHandler.createCommandsMenu();
    botHandler.registerScenes();
    botHandler.createStage();
    botHandler.handleCommands();
    botHandler.startCronJob();
    botHandler.connectDatabase();
    botHandler.launchBot();
  }
}

new App().init();
