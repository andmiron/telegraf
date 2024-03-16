import { TelegrafService } from './services/telegraf.service';
import { APIGatewayProxyEvent } from 'aws-lambda';

const bot = new TelegrafService();

bot.registerCommands();
bot.registerScenes();
bot.registerMiddlewares();
bot.createCommandsMenu();
bot.createStage();
bot.handleCommands();

export async function handler(event: APIGatewayProxyEvent) {
   await bot.connectDatabase();
   await bot.handleUpdate(event);
   return {
      statusCode: 200,
   };
}

export async function cron() {
   await bot.connectDatabase();
   await bot.onCronTick();
}
