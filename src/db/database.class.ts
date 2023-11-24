import mongoose from 'mongoose';
import User from './model.user.js';
import {UserDto} from '../dto/user.dto.js';

export class DatabaseClass {
  async connectDb(connectionString: string) {
    await mongoose.connect(connectionString);
  }

  async createOrUpdateUser(userData: UserDto) {
    return User.findOneAndUpdate(
      {chatId: userData.chatId},
      {
        offset: userData.offset,
        latitude: userData.latitude,
        longitude: userData.longitude,
        timeInput: userData.timeInput,
        time: userData.time,
      },
      {new: true, upsert: true}
    );
  }

  async findAllUsers() {
    return User.find().exec();
  }

  async findUser(chatId: number) {
    return User.findOne({chatId: chatId}).exec();
  }

  async deleteUser(chatId: number) {
    return User.deleteOne({chatId: chatId});
  }
}
