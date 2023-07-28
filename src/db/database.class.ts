import mongoose from 'mongoose';
import User from './model.user.js';

export class DatabaseClass {
  async connectDb(connectionString: string) {
    await mongoose.connect(connectionString);
  }

  async createOrUpdateUser(
    chatId: number,
    time: string,
    latitude: number,
    longitude: number,
    offset: number
  ) {
    return User.findOneAndUpdate(
      {chatId: chatId},
      {time: time, latitude: latitude, longitude: longitude, offset: offset},
      {new: true, upsert: true}
    );
  }

  async findUser(chatId: number) {
    return User.findOne({chatId: chatId});
  }

  async deleteUser(chatId: number) {
    return User.deleteOne({chatId: chatId});
  }
}
