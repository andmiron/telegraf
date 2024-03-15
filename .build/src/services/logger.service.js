"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const types_1 = require("../types/types");
const pino_1 = require("pino");
const node_process_1 = require("node:process");
const node_path_1 = __importDefault(require("node:path"));
class LoggerService {
    constructor() {
        const envConfig = process.env[types_1.EnvironmentVariableKeys.PRETTY_LOGGING];
        const transport = envConfig === types_1.LoggerOptions.DEVELOPMENT ? this.createDevTransport() : this.createProdTransport();
        this.logger = (0, pino_1.pino)({
            level: types_1.LoggerOptions.LEVEL_INFO,
            timestamp: pino_1.pino.stdTimeFunctions.isoTime,
            transport,
        });
    }
    createDevTransport() {
        return {
            target: types_1.LoggerOptions.PINO_PRETTY,
            options: {
                colorize: true,
                singleLine: true,
                ignore: types_1.LoggerOptions.IGNORE_FIELDS,
            },
        };
    }
    createProdTransport() {
        return {
            target: types_1.LoggerOptions.PINO_FILE,
            options: {
                destination: node_path_1.default.join((0, node_process_1.cwd)(), types_1.LoggerOptions.LOG_PATH),
            },
        };
    }
    logInfo(info) {
        this.logger.info({ info });
    }
    logError(errMsg) {
        this.logger.error({ error: errMsg });
    }
}
exports.LoggerService = LoggerService;
