import {Scenes, Telegraf} from 'telegraf';
import {ConfigService} from './services/config.service.js';
import {EnvironmentVariableKeys} from './types/types.js';
import {TelegrafService} from './services/telegraf.service.js';
import {StartCommand} from './commands/start.command.js';
import {SubscribeCommand} from './commands/subscribe.command.js';

class App {
  private readonly bot: Telegraf<Scenes.SceneContext>;

  constructor() {
    this.bot = new Telegraf<Scenes.SceneContext>(
      new ConfigService().getToken(EnvironmentVariableKeys.TELEGRAM_BOT_TOKEN)
    );
  }

  init(): void {
    const botHandler = new TelegrafService(this.bot);

    botHandler.registerMiddlewares();
    botHandler.createStage();

    botHandler.addCommand(new StartCommand('start', 'Start the bot'));
    botHandler.addCommand(new SubscribeCommand('subscribe', 'Get daily weather update'));
    botHandler.createCommandsMenu();

    botHandler.handleCommands();
    botHandler.handleCallbackQuery();

    botHandler.launchBot();
  }
}

const app = new App();

app.init();
