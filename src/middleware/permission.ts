import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

class PermissionMiddleware {
  // Método para verificar permisos
  public static checkPermission(permission: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await new User({ userId: req.user.userId }).findById();
        if (!user) {
           res.status(404).json({ message: "Usuario no encontrado" });
        }

        const hasPermission = user.roles.some(role => role.permissions.includes(permission));
        if (hasPermission) {
           next(); // El usuario tiene permiso
        } else {
           res.status(403).json({ message: "Acceso denegado: Sin permisos suficientes" });
        }
      } catch (error) {
         res.status(500).json({ message: "Error interno del servidor" });
      }
    };
  }
}

export default PermissionMiddleware;
