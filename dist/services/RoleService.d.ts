import { Role } from "../models/Role";
import { RoleInterface } from "../interfaces/RoleInterface";
export declare class RoleService {
    getPermissions(): {
        "Gesti\u00F3n de Cuentas": import("../config/permissions").Permissions[];
        "Gesti\u00F3n de Usuarios": import("../config/permissions").Permissions[];
        "Gesti\u00F3n de Categor\u00EDas": import("../config/permissions").Permissions[];
        "Gesti\u00F3n de Ingredientes": import("../config/permissions").Permissions[];
        "Gesti\u00F3n de Productos": import("../config/permissions").Permissions[];
        "Gesti\u00F3n de Sesiones": import("../config/permissions").Permissions[];
        "Gesti\u00F3n de Mesas": import("../config/permissions").Permissions[];
        "Gesti\u00F3n de Roles": import("../config/permissions").Permissions[];
        "Gesti\u00F3n de Transacciones": import("../config/permissions").Permissions[];
        "Gesti\u00F3n de Pedidos": import("../config/permissions").Permissions[];
    };
    createRole(data: RoleInterface): Promise<Role>;
    getRoles(): Promise<Role[]>;
    getRoleById(id: string): Promise<Role>;
    updateRole(id: string, updateData: Partial<RoleInterface>): Promise<Role>;
    deleteRole(id: string): Promise<boolean>;
}
