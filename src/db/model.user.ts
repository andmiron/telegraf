import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('Users', userSchema);

export default User;
