// User.ts
import { UserInterface } from "../interfaces/UserInterface";
import { checkPassword, hashPassword } from "../utils/auth";
import { UserRepository } from "../repositories/UserRepository";
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
        this.roles = data.roles ? data.roles.map(roleData => new Role(roleData)) : [];
        this.userRepository = new UserRepository();
    }

    /**
     * Verificar si el usuario existe basado en el email.
     */
    public async doesThatExist() {
        const userData = await this.userRepository.findByEmail(this.email);
        if (userData) {
            this.populateFromData(userData);
            return true;
        }
        return null;
    }

    /**
     * Encriptar contraseña y asignarla al usuario.
     */
    public async hashPassword() {
        this.password = await hashPassword(this.password);
    }

    /**
     * Verificar la contraseña en comparación con la almacenada.
     */
    public async checkPassword(password: string): Promise<boolean> {
        return await checkPassword(password, this.password);
    }

    /**
     * Buscar un usuario por ID, incluyendo los roles.
     */
    public async findById(): Promise<User | null> {
        const userData = await this.userRepository.findById(this.userId, 'roles');
        if (userData) {
            this.populateFromData(userData);
            return this;
        }
        return null;
    }

    /**
     * Actualizar los datos del usuario. 
     * La función maneja la conversión de `Role` a `roleId` antes de enviar al repositorio.
     */
    public async update(data: Partial<UserInterface>): Promise<User | null> {
      // Convertir `data.roles` a IDs si se proporcionan, para enviar solo los IDs al repositorio
      const updateData = {
          ...data,
          roles: data.roles
      };

      // Actualizar en el repositorio
      const updatedUser = await this.userRepository.update(this.userId, updateData);
      
      // Si se actualiza, llenar los datos del usuario
      if (updatedUser) {
          this.populateFromData(updatedUser);
          return this;
      }
      
      return null;
  }
    /**
     * Eliminar el usuario de la base de datos.
     */
    public async delete(): Promise<boolean> {
        return await this.userRepository.delete(this.userId);
    }

    /**
     * Guardar el usuario en la base de datos. 
     * Convierte `roles` a solo `roleIds` para almacenar en MongoDB.
     */
    public async save(): Promise<User> {
        const savedUser = await this.userRepository.save({
            ...this,
            roles: this.roles.map(role => role.roleId) // Enviar solo los role IDs
        });
        this.userId = savedUser.id;
        return this;
    }

    /**
     * Cargar datos en el usuario actual desde la estructura de la base de datos.
     */
    private populateFromData(userData: any) {
        this.userId = userData.userId || userData.id;
        this.name = userData.name;
        this.lastname = userData.lastname;
        this.email = userData.email;
        this.password = userData.password;
        this.confirmed = userData.confirmed;
        this.roles = userData.roles ? userData.roles.map(role => role instanceof Role ? role : new Role({roleId: role.id, name: role.name, permissions: role.permissions})) : this.roles;
    }

    /**
     * Obtener todos los usuarios por ID de Rol.
     */
    static async getUsersByRole(roleId: string): Promise<User[] | null> {
        const userRepository = new UserRepository();
        const usersData = await userRepository.getUsersByRole(roleId);
        if (usersData) {
            return usersData.map(userData => {
                const user = new User({});
                user.populateFromData(userData);
                return user;
            });
        }
        return null;
    }
}
