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
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const redis_1 = require("redis");
let redis = null;
exports.redis = redis;
if (process.env.REDIS_URL) {
    exports.redis = redis = (0, redis_1.createClient)({
        url: process.env.REDIS_URL
    });
    redis.on('error', (err) => {
        console.warn('Redis não disponível:', err.message);
        exports.redis = redis = null;
    });
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (redis && !redis.isOpen) {
                yield redis.connect();
                console.log('✅ Redis conectado com sucesso');
            }
        }
        catch (error) {
            console.warn('Redis não disponível');
            exports.redis = redis = null;
        }
    }))();
}
else {
    console.warn('Redis não configurado');
}
