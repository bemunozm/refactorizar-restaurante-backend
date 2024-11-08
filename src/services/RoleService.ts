import { Role } from "../models/Role";
import { RoleInterface } from "../interfaces/RoleInterface";
import { permissionGroups } from "../config/permissions";


export class RoleService {
    public getPermissions() {
        return permissionGroups;
    }

    public async createRole(data: RoleInterface) {
        const role = new Role(data);
        return await role.save();
    }

    public async getRoles() {
        const roles = await Role.getAll();
        return roles;
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
        return await role.delete();
    }
}
