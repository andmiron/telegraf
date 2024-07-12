import { TelegrafService } from './services/telegraf.service';

export default function bootstrap() {
   const bot = new TelegrafService();
   bot.connectDatabase();
   bot.registerCommands();
   bot.registerScenes();
   bot.createCommandsMenu();
   bot.registerMiddlewares();
   bot.createStage();
   bot.startCronJob();
   bot.handleCommands();
   return bot;
}
