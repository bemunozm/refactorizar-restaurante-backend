import { Role } from "../models/Role";
import { RoleInterface } from "../interfaces/RoleInterface";
import { permissionGroups } from "../config/permissions";
import { User } from "../models/User";

export class RoleService {
    public getPermissions() {
        return permissionGroups;
    }

    public async createRole(data: RoleInterface) {
        const role = new Role(data);
        return await role.save();
    }

    public async getRoles() {
        return await Role.getAll();
    }

    public async getRoleById(id: string) {
        const role = new Role({ roleId: id });
        return await role.findById();
    }

    public async updateRole(id: string, updateData: Partial<RoleInterface>) {
        const role = new Role({ roleId: id });
        return await role.update(updateData);
    }

    public async deleteRole(id: string) {
        const role = new Role({ roleId: id });
        
        const roleExists = await role.findById();
        if (!roleExists) {
            throw new Error('Rol no encontrado');
        }

        const users = await User.getUsersByRole(role.roleId);
        if (users && users.length > 0) {
            throw new Error('No se puede eliminar el rol porque tiene usuarios asociados');
        }

        return await role.delete();
    }
}
