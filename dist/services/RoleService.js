"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const Role_1 = require("../models/Role");
const permissions_1 = require("../config/permissions");
const User_1 = require("../models/User");
class RoleService {
    getPermissions() {
        return permissions_1.permissionGroups;
    }
    async createRole(data) {
        const role = new Role_1.Role(data);
        return await role.save();
    }
    async getRoles() {
        return await Role_1.Role.getAll();
    }
    async getRoleById(id) {
        const role = new Role_1.Role({ roleId: id });
        return await role.findById();
    }
    async updateRole(id, updateData) {
        const role = new Role_1.Role({ roleId: id });
        return await role.update(updateData);
    }
    async deleteRole(id) {
        const role = new Role_1.Role({ roleId: id });
        const roleExists = await role.findById();
        if (!roleExists) {
            throw new Error('Rol no encontrado');
        }
        const users = await User_1.User.getUsersByRole(role.roleId);
        if (users && users.length > 0) {
            throw new Error('No se puede eliminar el rol porque tiene usuarios asociados');
        }
        return await role.delete();
    }
}
exports.RoleService = RoleService;
//# sourceMappingURL=RoleService.js.map