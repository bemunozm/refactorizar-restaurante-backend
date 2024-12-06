"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const RoleRepository_1 = require("../repositories/RoleRepository");
class Role {
    roleId;
    name;
    permissions;
    roleRepository;
    constructor(data) {
        this.roleId = data.roleId;
        this.name = data.name || '';
        this.permissions = data.permissions || [];
        this.roleRepository = new RoleRepository_1.RoleRepository();
    }
    populateRole(roleData) {
        this.roleId = roleData.id;
        this.name = roleData.name;
        this.permissions = roleData.permissions;
    }
    async save() {
        const savedRole = await this.roleRepository.save(this.toDatabaseObject());
        this.populateRole(savedRole);
        return this;
    }
    async update(updateData) {
        if (this.name === 'Administrador' || this.name === 'Usuario') {
            return null;
        }
        const updatedRole = await this.roleRepository.update(this.roleId, updateData);
        if (updatedRole) {
            this.populateRole(updatedRole);
            return this;
        }
        return null;
    }
    static async getAll() {
        const roleRepository = new RoleRepository_1.RoleRepository();
        const roles = await roleRepository.findAll();
        return roles.map(roleData => {
            const role = new Role({});
            role.populateRole(roleData);
            return role;
        });
    }
    async findById() {
        const roleData = await this.roleRepository.findById(this.roleId);
        if (roleData) {
            this.populateRole(roleData);
            return this;
        }
        return null;
    }
    async delete() {
        if (this.name === 'Administrador' || this.name === 'Usuario') {
            return null;
        }
        return await this.roleRepository.delete(this.roleId);
    }
    async findByName() {
        const roleData = await this.roleRepository.findOne({ name: this.name });
        if (roleData) {
            this.populateRole(roleData);
            return this;
        }
        return null;
    }
    toDatabaseObject() {
        return {
            name: this.name,
            permissions: this.permissions,
        };
    }
}
exports.Role = Role;
//# sourceMappingURL=Role.js.map