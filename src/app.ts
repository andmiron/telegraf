import {Scenes, Telegraf} from 'telegraf';
import {ConfigService} from './services/config.service.js';
import {EnvironmentVariableKeys} from './types/types.js';
import {TelegrafService} from './services/telegraf.service.js';
import {StartCommand} from './commands/start.command.js';
import {SubscribeCommand} from './commands/subscribe.command.js';
import {UnsubscribeCommand} from './commands/unsubscribe.command.js';
import {CheckCommand} from './commands/check.command.js';
import {UpdateCommand} from './commands/update.command.js';

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

    botHandler.addCommand(new StartCommand('start', 'Start the bot'));
    botHandler.addCommand(new SubscribeCommand('subscribe', 'Get daily weather updates'));
    botHandler.addCommand(new UnsubscribeCommand('unsubscribe', 'Stop getting weather updates'));
    botHandler.addCommand(new UpdateCommand('update', 'Update subscription data'));
    botHandler.addCommand(new CheckCommand('check', 'Check subscription status'));

    botHandler.createCommandsMenu();
    botHandler.handleCommands();

    botHandler.launchBot();
  }
}

const app = new App();

app.init();
