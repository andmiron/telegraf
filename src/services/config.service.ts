import { config, DotenvParseOutput } from 'dotenv';

export class ConfigService {
   private envConfig: DotenvParseOutput;

   constructor() {
      const { error, parsed } = config();
      if (error) throw new Error('Env file not found!');
      if (!parsed) throw new Error('Env file parsing error!');
      this.envConfig = parsed;
   }

   getToken(envVarKey: string): string {
      return this.envConfig[envVarKey];
   }
}
