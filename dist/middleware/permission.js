"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
class PermissionMiddleware {
    // Método para verificar permisos
    static checkPermission(permission) {
        return async (req, res, next) => {
            try {
                const user = await new User_1.User({ userId: req.user.userId }).findById();
                if (!user) {
                    res.status(404).json({ message: "Usuario no encontrado" });
                }
                const hasPermission = user.roles.some(role => role.permissions.includes(permission));
                if (hasPermission) {
                    next(); // El usuario tiene permiso
                }
                else {
                    res.status(403).json({ message: "Acceso denegado: Sin permisos suficientes" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Error interno del servidor" });
            }
        };
    }
}
exports.default = PermissionMiddleware;
//# sourceMappingURL=permission.js.map