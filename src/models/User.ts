
import { UserInterface } from "../interfaces/UserInterface";
import { checkPassword, hashPassword } from "../utils/auth";
import { UserRepository } from "../repositories/UserRepository";
import { RoleInterface } from "../interfaces/RoleInterface";
import { Role } from "./Role";

export class User implements UserInterface {
  public userId: string;
  public name: string;
  public lastname: string;
  public email: string;
  public password: string;
  public confirmed: boolean;
  public roles: Role[];
  private userRepository: UserRepository;

  constructor(data: Partial<UserInterface>) {
    this.userId = data.userId || '';
    this.name = data.name || '';
    this.lastname = data.lastname || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.confirmed = data.confirmed || false;
    this.roles = data.roles || [];
    this.userRepository = new UserRepository()
  }

  //Verificar si existe
  public async doesThatExist(){
    const userData = await this.userRepository.findByEmail(this.email);
    
    if (userData) {
      const roles = userData.roles.map((role : RoleInterface) => { return new Role({roleId: role.roleId, name: role.name, permissions: role.permissions}) });

      this.userId = userData.userId;
      this.name = userData.name;
      this.lastname = userData.lastname;
      this.email = userData.email;
      this.password = userData.password;
      this.confirmed = userData.confirmed;
      this.roles = roles;
      return true;
    }

    return null;
  }

  //Encriptar contraseña
  public async hashPassword(){
    const hashedPassword = await hashPassword(this.password)
    this.password = hashedPassword
  }

  //Verificar contraseña
  public async checkPassword(password: string){
    return await checkPassword(password, this.password)
  }

  //Buscar por ID
  public async findById(){
    const userData = await this.userRepository.findById(this.userId, 'roles');
    if (userData) {
      const roles = userData.roles.map((role : any) => { return new Role({roleId: role.id, name: role.name, permissions: role.permissions}) });
      
      this.userId = userData.id;
      this.name = userData.name;
      this.lastname = userData.lastname;
      this.email = userData.email;
      this.password = userData.password;
      this.confirmed = userData.confirmed;
      this.roles = roles;
      return this;
    }

    return null;
  }

  //Actualizar
  public async update(data: Partial<UserInterface>){
    const updatedUser = await this.userRepository.update(this.userId, data);
    if (updatedUser) {
      const roles = updatedUser.roles.map((role : RoleInterface) => { return new Role({roleId: role.roleId, name: role.name, permissions: role.permissions}) });

      this.userId = updatedUser.id;
      this.name = updatedUser.name;
      this.lastname = updatedUser.lastname;
      this.email = updatedUser.email;
      this.password = updatedUser.password;
      this.confirmed = updatedUser.confirmed;
      this.roles = roles;
      return this;
    }

    return null;
  }

  //Eliminar
  public async delete(){
    return await this.userRepository.delete(this.userId);
  }

  //Guardar en la base de datos
  public async save() {
    const savedUser = await this.userRepository.save(this);
    this.userId = savedUser.userId; // Actualiza el userId con el ID generado por Mongoose
    return this // Devuelve el objeto actualizado
  }
}
