"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const model_user_1 = __importDefault(require("./model.user"));
const mongoose_1 = __importDefault(require("mongoose"));
class DatabaseService {
    connectDb(connectionString) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoose_1.default.connect(connectionString);
        });
    }
    upsert(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return model_user_1.default.findOneAndUpdate({ chatId: user.chatId }, user, { upsert: true }).exec();
        });
    }
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return model_user_1.default.find({}).exec();
        });
    }
    findUser(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return model_user_1.default.findOne({ chatId }).exec();
        });
    }
    deleteUser(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return model_user_1.default.deleteOne({ chatId });
        });
    }
}
exports.DatabaseService = DatabaseService;
