import mongoose from 'mongoose';
import {Models} from '../types/types.js';

const userSchema = new mongoose.Schema({
  chatId: {
    type: Number,
    required: true,
    unique: true,
  },
  timeInput: String,
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

const User = mongoose.model(Models.USERS, userSchema);

export default User;
