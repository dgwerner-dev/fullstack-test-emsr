"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const jwt_1 = require("../utils/jwt");
/**
 * Middleware que valida o JWT e adiciona userId e role ao request.
 */
function authenticate(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const token = auth.split(' ')[1];
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.userId = payload.userId;
        req.role = payload.role;
        next();
    }
    catch (_a) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}
/**
 * Middleware que restringe acesso a determinadas roles (ex: ADMIN).
 */
function authorize(roles) {
    return (req, res, next) => {
        const role = req.role;
        if (!roles.includes(role)) {
            return res.status(403).json({ error: 'Acesso negado' });
        }
        next();
    };
}
