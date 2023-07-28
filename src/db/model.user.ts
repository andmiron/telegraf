import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  chatId: {
    type: Number,
    required: true,
    unique: true,
  },
  time: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  offset: {
    type: Number,
    required: true,
  },
});

const User = mongoose.model('Users', userSchema);

export default User;
