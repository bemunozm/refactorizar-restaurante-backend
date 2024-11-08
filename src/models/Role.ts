import { RoleRepository } from "../repositories/RoleRepository";
import { RoleInterface } from "../interfaces/RoleInterface";

export class Role implements RoleInterface {
    public roleId?: string;
    public name: string;
    public permissions: string[];
    private roleRepository: RoleRepository;

    constructor(data: Partial<RoleInterface>) {
        this.roleId = data.roleId;
        this.name = data.name || '';
        this.permissions = data.permissions || [];
        this.roleRepository = new RoleRepository();
    }

    private populateRole(roleData: any): void {
        this.roleId = roleData.id;
        this.name = roleData.name;
        this.permissions = roleData.permissions;
    }

    public async save() {
        const savedRole = await this.roleRepository.save(this);
        this.populateRole(savedRole);
        return this;
    }

    public async update(updateData: Partial<RoleInterface>) {
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
        const roleRepository = new RoleRepository();
        const roles = await roleRepository.findAll();
        return roles.map(roleData => {
            const role = new Role({});
            role.populateRole(roleData);
            return role;
        });
    }

    public async findById() {
        const roleData = await this.roleRepository.findById(this.roleId);
        if (roleData) {
            this.populateRole(roleData);
            return this;
        }
        return null;
    }

    public async delete() {
        if (this.name === 'Administrador' || this.name === 'Usuario') {
            return null;
        }
        return await this.roleRepository.delete(this.roleId);
    }

    public async findByName() {
        const roleData = await this.roleRepository.findOne({name: this.name});
        if (roleData) {
            this.populateRole(roleData);
            return this;
        }
        return null;
    }
}
