"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    chatId: { type: String, required: true, unique: true },
    timeInput: { type: String, required: true },
    time: { type: Number, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    offset: { type: Number, required: true },
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
