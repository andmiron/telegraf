import User from './model.user';
import { UserDto } from '../dto/user.dto';
import mongoose from 'mongoose';

export class DatabaseService {
   async connectDb(connectionString: string) {
      await mongoose.connect(connectionString);
   }

   async upsert(user: UserDto) {
      return User.findOneAndUpdate({ chatId: user.chatId }, user, { upsert: true }).exec();
   }

   async findAllUsers() {
      return User.find({}).exec();
   }

   async findUser(chatId: number) {
      return User.findOne({ chatId }).exec();
   }

   async deleteUser(chatId: number) {
      return User.deleteOne({ chatId });
   }
}
