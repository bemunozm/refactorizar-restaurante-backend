import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { RoleRepository } from "../repositories/RoleRepository";

class PermissionMiddleware {
  private static userRepository = new UserRepository();

  // Método para verificar permisos
  public static checkPermission(permission: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await PermissionMiddleware.userRepository.findById(req.user.id);
        if (!user) {
          return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const hasPermission = user.roles.some(role => role.permissions.includes(permission));
        if (hasPermission) {
          return next(); // El usuario tiene permiso
        } else {
          return res.status(403).json({ message: "Acceso denegado: Sin permisos suficientes" });
        }
      } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor" });
      }
    };
  }
}

export default PermissionMiddleware;
