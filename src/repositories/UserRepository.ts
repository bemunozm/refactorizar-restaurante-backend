// UserRepository.ts

import { UserDocument } from "../interfaces/UserInterface";
import { GenericRepository } from "./GenericRepository";
import { User } from "../models/User";
import UserModel from "../schemas/UserSchema";

export class UserRepository extends GenericRepository<UserDocument> {
  private static mongooseModel = UserModel;

  constructor() {
    super(UserRepository.mongooseModel);
  }

  /**
   * Buscar un usuario por email e incluir los roles.
   */
  public async findByEmail(email: string): Promise<Partial<UserDocument> | null> {
    try {
      const userModel = await this.model.findOne({ email }).populate("roles").exec();
      if (userModel) {
        return {
          userId: userModel.id,
          name: userModel.name,
          lastname: userModel.lastname,
          email: userModel.email,
          password: userModel.password,
          confirmed: userModel.confirmed,
          roles: userModel.roles
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error al buscar por email: ${error}`);
      throw new Error("Error al buscar el documento por email");
    }
  }

  /**
   * Obtener todos los usuarios con la opción de poblado de relaciones.
   */
  public async getAllUsers(populate?: string | string[]): Promise<Partial<UserDocument>[] | null> {
    try {
      const userModel = await super.findAll(populate);
      if (userModel) {
        return userModel.map(user => ({
          userId: user.id,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          password: user.password,
          confirmed: user.confirmed,
          roles: user.roles
        }));
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error al obtener todos los usuarios: ${error}`);
      throw new Error("Error al obtener los usuarios");
    }
  }

  /**
   * Guardar una instancia de User en la base de datos.
   */
  public async save(user: User): Promise<UserDocument> {
    try {

      // Crear un documento de usuario con los IDs de roles asignados
      const userDocument = new this.model({
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        password: user.password,
        confirmed: user.confirmed,
        roles: user.roles,
      });

      return await userDocument.save();
    } catch (error) {
      console.error(`Error al guardar el usuario: ${error}`);
      throw new Error("Error al guardar el documento del usuario");
    }
  }

  /**
   * Obtener todos los usuarios asociados a un rol específico.
   */
  public async getUsersByRole(roleId: string): Promise<UserDocument[] | null> {
    try {
      return await this.model.find({ roles: roleId }).populate("roles").exec();
    } catch (error) {
      console.error(`Error al buscar usuarios por rol: ${error}`);
      throw new Error("Error al buscar el documento por rol");
    }
  }
}
