"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Session_1 = require("../models/Session");
const User_1 = require("../models/User");
const Table_1 = require("../models/Table");
class AuthMiddleware {
    static async authenticate(req, res, next) {
        const bearer = req.headers.authorization;
        if (!bearer) {
            res.status(401).json({ error: "No Autorizado" });
            return;
        }
        const [, token] = bearer.split(" ");
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            let session;
            if (decoded.sessionId !== '') {
                session = new Session_1.Session({ sessionId: decoded.sessionId });
                await session.findById();
            }
            let table;
            if (decoded.tableId !== '') {
                table = new Table_1.Table({ tableId: decoded.tableId });
                await table.findById();
            }
            // Asigna sessionId y tableId desde el token decodificado, si existen
            req.sessionId = session || undefined;
            req.tableId = table || undefined;
            if (decoded.role === "Usuario") {
                // Usuario registrado
                const user = new User_1.User({ userId: decoded.id });
                await user.findById();
                if (user) {
                    req.user = user;
                    req.role = "Usuario";
                    next();
                }
                else {
                    res.status(401).json({ error: "Usuario No Encontrado" });
                }
            }
            else if (decoded.role === "Invitado") {
                if (!session) {
                    res.status(500).json({ error: "Este invitado no pertenece a ninguna sesión activa" });
                    return;
                }
                const guest = session.guests.find((guest) => guest.guestId === decoded.id);
                console.log('session');
                if (guest) {
                    req.guest = guest;
                    req.role = "Invitado";
                    next();
                }
                else {
                    res.status(500).json({ error: "Invitado No Encontrado" });
                }
            }
            else {
                res.status(401).json({ error: "Rol no autorizado" });
            }
        }
        catch (error) {
            res.status(401).json({ error: "Token No Válido" });
        }
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=auth.js.map