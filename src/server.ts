import { TelegrafService } from './services/telegraf.service';
import { APIGatewayProxyEvent } from 'aws-lambda';

const bot = new TelegrafService();

bot.registerCommands();
bot.handleCommands();
bot.registerScenes();
bot.createCommandsMenu();
bot.createStage();
bot.registerMiddlewares();

export async function handler(event: APIGatewayProxyEvent) {
   await bot.connectDatabase();
   await bot.handleUpdate(event);
   return {
      statusCode: 200,
   };
}

export async function cron(event: APIGatewayProxyEvent) {
   await bot.connectDatabase();
   await bot.handleUpdate(event);
   bot.startCronJob();
}
