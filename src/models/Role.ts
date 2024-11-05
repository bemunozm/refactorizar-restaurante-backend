import {  RoleInterface } from "../interfaces/RoleInterface";
import { RoleRepository } from "../repositories/RoleRepository";

export class Role implements RoleInterface {
  public roleId: string;
  public name?: string;
  public permissions?: RoleInterface["permissions"];
  private roleRepository: RoleRepository;

  constructor(data: RoleInterface) {
    this.roleId = data.roleId;
    this.name = data.name || '';
    this.permissions = data.permissions || [];
    this.roleRepository = new RoleRepository();
  }

  // Métodos específicos para rol podrían añadirse aquí
  public async findByName() {
    const roleData = await this.roleRepository.findOne({name: this.name});
    
    if (roleData) {
      // Cargar los datos directamente en la instancia actual usando el objeto plano
      this.roleId = roleData.id;
      this.name = roleData.name;
      this.permissions = roleData.permissions;
      return true;
    }

    return false;
  }

}
