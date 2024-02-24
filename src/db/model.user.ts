import {Model} from 'sequelize';

export class User extends Model {
  declare chatId: number;
  declare timeInput: string;
  declare time: number;
  declare latitude: number;
  declare longitude: number;
  declare offset: number;
}
