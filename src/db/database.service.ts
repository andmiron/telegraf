import {User} from './model.user.js';
import {DataTypes, Sequelize} from 'sequelize';
import {Models} from '../types/types.js';
import {UserDto} from '../dto/user.dto.js';

export class DatabaseService {
  async connectDb() {
    const sequelize = new Sequelize('sqlite::memory:');
    User.init(
      {
        chatId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
        },
        timeInput: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        time: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        latitude: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        longitude: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        offset: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize: sequelize,
        modelName: Models.USERS,
      }
    );
    await sequelize.sync();
    await sequelize.authenticate();
  }

  async upsert(user: UserDto) {
    return User.upsert({...user});
  }

  async findAllUsers() {
    return User.findAll();
  }

  async findUser(chatId: number) {
    return User.findOne({where: {chatId}});
  }

  async deleteUser(chatId: number) {
    return User.destroy({where: {chatId}});
  }
}
