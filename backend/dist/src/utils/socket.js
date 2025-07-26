"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIO = setIO;
exports.getIO = getIO;
let io = null;
function setIO(ioInstance) {
    io = ioInstance;
}
function getIO() {
    if (!io) {
        // Em ambiente de teste, retorna um mock simples
        if (process.env.NODE_ENV === 'test') {
            return {
                emit: () => { },
                on: () => { },
                off: () => { }
            };
        }
        throw new Error("Socket.io não inicializado");
    }
    return io;
}
