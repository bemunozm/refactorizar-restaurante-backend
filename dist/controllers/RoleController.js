"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const RoleService_1 = require("../services/RoleService");
class RoleController {
    roleService;
    constructor() {
        this.roleService = new RoleService_1.RoleService();
    }
    getPermissions(req, res) {
        try {
            const permissions = this.roleService.getPermissions();
            return res.status(200).json(permissions);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener la lista de permisos' });
        }
    }
    async createRole(req, res) {
        try {
            const { name, permissions } = req.body;
            const role = await this.roleService.createRole({ name, permissions });
            return res.status(201).json(role);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al crear el rol' });
        }
    }
    async getRoles(req, res) {
        try {
            const roles = await this.roleService.getRoles();
            return res.status(200).json(roles);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener los roles' });
        }
    }
    async getRoleById(req, res) {
        try {
            const { id } = req.params;
            const role = await this.roleService.getRoleById(id);
            return role
                ? res.status(200).json(role)
                : res.status(404).json({ error: 'Rol no encontrado' });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener el rol' });
        }
    }
    async updateRole(req, res) {
        try {
            const { id } = req.params;
            const { name, permissions } = req.body;
            const result = await this.roleService.updateRole(id, { name, permissions });
            return result
                ? res.status(200).json({ message: 'Rol actualizado correctamente' })
                : res.status(403).json({ message: 'No se puede modificar este rol por defecto' });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al actualizar el rol', error });
        }
    }
    async deleteRole(req, res) {
        try {
            const { id } = req.params;
            const result = await this.roleService.deleteRole(id);
            return result
                ? res.status(200).json({ message: 'Rol eliminado correctamente' })
                : res.status(404).json({ message: 'Rol no encontrado' });
        }
        catch (error) {
            if (error.message === 'No se puede eliminar el rol porque tiene usuarios asociados') {
                return res.status(400).json({ message: error.message });
            }
            console.error(error);
            return res.status(500).json({ message: 'Error al eliminar el rol', error });
        }
    }
}
exports.RoleController = RoleController;
//# sourceMappingURL=RoleController.js.map