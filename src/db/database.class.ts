import mongoose from 'mongoose';
import {DatabaseInterface} from './database.interface.js';
import User from './model.user.js';

export class DatabaseClass implements DatabaseInterface {
  private readonly connectionString: string;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  async connectDb() {
    await mongoose.connect(this.connectionString);
  }

  async createUser(userId: number, time: string) {
    await User.create({userId: userId, time: time});
  }

  async updateUser(userId: number, time: string) {
    await User.findOneAndUpdate({userId: userId}, {time: time}, {new: true});
  }

  async deleteUser(userId: number) {
    await User.deleteOne({userId: userId});
  }
}
