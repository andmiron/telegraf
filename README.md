## Description

Telegram bot giving simple instant weather update based on user location with the Telegraf libray. Also user can susbcribe to everyday weather updates.

Tried to write it with an OOP approach, Command Pattern. This way seemed to me more suitable for writing telegram bot so I could add as many commands as I want and write their own logic encapsulated.

Project stack:

-  TelegrafJS
-  MongoDB with Mongoose
-  axios
-  pino logger
-  cron
-  serverless
-  ts-node

### Commands

-  `/start`

   > builds commands menu and sends welcome message

-  `/weather`

   > requests user location and sends instant weather forecast based on it

-  `/subscribe`

   > requests time and location and sets the subscription for weather updates

-  `/unsubscribe`

   > cancel active subscription

-  `/update`

   > update subscription time or location

-  `/check`
   > check active subscription status

### Project structure

```bash
.
├── compose.yaml
├── Dockerfile
├── package.json
├── package-lock.json
├── README.md
├── serverless.yml
├── src
│   ├── commands
│   │   ├── check.command.ts
│   │   ├── getWeather.command.ts
│   │   ├── start.command.ts
│   │   ├── subscribe.command.ts
│   │   ├── unsubscribe.command.ts
│   │   └── update.command.ts
│   ├── db
│   │   ├── database.service.ts
│   │   └── model.user.ts
│   ├── dto
│   │   └── user.dto.ts
│   ├── interfaces
│   │   ├── bot.command.interface.ts
│   │   └── custom.context.ts
│   ├── scenes
│   │   ├── scene.creator.ts
│   │   └── subscribe.scene.ts
│   ├── server.dev.ts
│   ├── server.ts
│   ├── services
│   │   ├── cron.service.ts
│   │   ├── logger.service.ts
│   │   ├── telegraf.service.ts
│   │   └── weather.client.ts
│   ├── types
│   │   └── types.ts
│   └── utils
│       ├── string.generator.ts
│       └── timeConverter.class.ts
└── tsconfig.json

```

### Production

The bot is up and running on aws-lambda with serverless.

[Link](https://t.me/and_miron_bot) and [QRCode](image.png)
