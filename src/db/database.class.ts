import mongoose from 'mongoose';
import User from './model.user.js';

export class DatabaseClass {
  async connectDb(connectionString: string) {
    await mongoose.connect(connectionString);
  }

  async createOrUpdateUser(userId: number, time: string, latitude: number, longitude: number) {
    return User.findOneAndUpdate(
      {userId: userId},
      {time: time, latitude: latitude, longitude: longitude},
      {new: true, upsert: true}
    );
  }

  async findUser(userId: number) {
    return User.findOne({userId: userId});
  }

  async deleteUser(userId: number) {
    return User.deleteOne({userId: userId});
  }
}
