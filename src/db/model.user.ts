import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
   chatId: { type: String, required: true, unique: true },
   timeInput: { type: String, required: true },
   time: { type: Number, required: true },
   latitude: { type: Number, required: true },
   longitude: { type: Number, required: true },
   offset: { type: Number, required: true },
});

const User = mongoose.model('User', userSchema);
export default User;
