import {Scenes, session, Telegraf} from 'telegraf';
import {LoggerService} from './logger.service.js';
import {CommandClass} from '../commands/command.class.js';
import {DatabaseClass} from '../db/database.class.js';
import {ConfigService} from './config.service.js';
import {EnvironmentVariableKeys} from '../types/types.js';
import {SceneCreator} from '../scenes/scene.creator.js';

export class TelegrafService {
  private readonly bot: Telegraf<Scenes.SceneContext>;
  private logger: LoggerService;
  private commands: CommandClass[];
  private database: DatabaseClass;

  constructor(bot: Telegraf<Scenes.SceneContext>) {
    this.bot = bot;
    this.logger = new LoggerService();
    this.commands = [];
    this.database = new DatabaseClass(
      new ConfigService().getToken(EnvironmentVariableKeys.MONGO_DB_STRING)
    );
  }

  addCommand(command: CommandClass): void {
    this.commands.push(command);
  }

  registerMiddlewares(): void {
    this.bot.use(async (ctx, next) => {
      this.logger.logInfo(
        `${ctx.from ? ctx.from.username : 'Unknown user'}: sent ${ctx.updateType}`
      );
      await next();
    });

    const stage = this.createStage();
    this.bot.use(session());
    this.bot.use(stage.middleware());
  }

  createStage() {
    const scenes = new SceneCreator().createWeatherScene();
    return new Scenes.Stage<Scenes.SceneContext>([scenes]);
  }

  createCommandsMenu(): void {
    this.bot.telegram
      .setMyCommands(this.commands)
      .then(() => {
        this.logger.logInfo('Commands menu successfully set!');
      })
      .catch(err => {
        this.logger.logError(err);
      });
  }

  launchBot(): void {
    this.bot.telegram.getMe().then(user => {
      this.bot.launch();
      this.logger.logInfo(`Bot ${user.username} started`);
    });

    this.database
      .connectDb()
      .then(() => {
        this.logger.logInfo('Database connected');
      })
      .catch(err => {
        this.logger.logError(err);
      });
  }

  handleCommands(): void {
    this.bot.command(/\S+/, ctx => {
      const userInput = ctx.message.text.slice(1);
      const commandToExecute = this.commands.find(command => command.command === userInput);
      const response = 'Unknown command...';

      if (commandToExecute) {
        commandToExecute.execute(ctx);
      } else {
        ctx.reply(response);
      }
    });
  }

  handleCallbackQuery(): void {
    this.bot.action('startWeatherScene', async ctx => {
      await ctx.scene.enter('weatherScene');
      await ctx.answerCbQuery();
    });
  }
}
